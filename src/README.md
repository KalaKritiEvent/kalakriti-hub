
# Kalakriti Hub - Implementation Guide

This guide provides detailed steps for implementing MongoDB authentication and Amazon S3 file storage in your Kalakriti Hub application.

## MongoDB Authentication Integration

### Step 1: Set Up MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient to start)
3. Create a database user with password authentication
4. Whitelist your IP address (use `0.0.0.0/0` for development)
5. Get your connection string from the Atlas dashboard

### Step 2: Install Required Packages

```bash
npm install mongodb jsonwebtoken bcrypt
```

### Step 3: Create MongoDB Connection Utility

Create a utility file to handle MongoDB connections:

```javascript
// src/lib/mongodb.js
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
```

### Step 4: Implement Authentication API Routes

Create API routes for authentication:

```javascript
// src/api/auth.js
import { connectToDatabase } from '../lib/mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export async function login(req, res) {
  const { email, password } = req.body;

  try {
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        contestantId: user.contestantId || null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        contestantId: user.contestantId || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function signup(req, res) {
  const { firstName, lastName, email, password, contestantId } = req.body;

  try {
    const { db } = await connectToDatabase();
    
    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const result = await db.collection('users').insertOne({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      contestantId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const user = await db.collection('users').findOne({ _id: result.insertedId });

    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        contestantId: user.contestantId || null
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        contestantId: user.contestantId || null
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Step 5: Create Authentication Middleware

Create middleware to protect routes:

```javascript
// src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

## Amazon S3 Integration for File Storage

### Step 1: Set Up AWS Account and S3 Bucket

1. Create an AWS account if you don't already have one
2. Create an IAM user with programmatic access and S3 permissions
3. Note down the Access Key ID and Secret Access Key
4. Create an S3 bucket for storing uploads
5. Configure CORS for your bucket to allow uploads from your domain

### Step 2: Install AWS SDK

```bash
npm install aws-sdk
```

### Step 3: Create S3 Utility Functions

Create utility functions for S3 operations:

```javascript
// src/lib/s3.js
import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

export async function uploadFileToS3(file, folder = '') {
  const fileName = `${folder}/${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location; // Return the URL of the uploaded file
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

export async function deleteFileFromS3(fileUrl) {
  // Extract key from URL
  const key = fileUrl.split('/').slice(3).join('/');

  const params = {
    Bucket: BUCKET_NAME,
    Key: key
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw error;
  }
}
```

### Step 4: Create File Upload API Route

Create an API route for file uploads:

```javascript
// src/api/uploads.js
import { uploadFileToS3 } from '../lib/s3';
import { connectToDatabase } from '../lib/mongodb';
import { authMiddleware } from '../middleware/auth';
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// Set up the route
export default function uploadRoute(app) {
  app.post('/api/upload', authMiddleware, upload.array('files', 5), async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const { eventType, title, description } = req.body;
      const userId = req.user.userId;

      // Upload files to S3
      const fileUrls = await Promise.all(
        req.files.map(file => uploadFileToS3(file, `submissions/${eventType}`))
      );

      // Save submission to database
      const { db } = await connectToDatabase();
      
      const submission = {
        userId,
        eventType,
        title,
        description,
        fileUrls,
        createdAt: new Date(),
        status: 'submitted'
      };
      
      const result = await db.collection('submissions').insertOne(submission);
      
      // Update user record
      await db.collection('users').updateOne(
        { _id: userId },
        { 
          $push: { 
            submissions: {
              submissionId: result.insertedId,
              eventType,
              submissionDate: new Date(),
              status: 'submitted'
            } 
          } 
        }
      );

      res.status(200).json({
        success: true,
        submission: {
          id: result.insertedId,
          ...submission
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'File upload failed' });
    }
  });
}
```

## Environment Variables

Create a `.env` file in the root of your project with the following variables:

```
# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
MONGODB_DB=kalakriti_hub

# JWT
JWT_SECRET=your_jwt_secret_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=kalakriti-hub-uploads
```

## Next Steps

1. Implement the frontend components to interact with these APIs
2. Set up proper error handling and validation
3. Configure environment variables for different environments (development, production)
4. Implement user profile management and submission editing features
5. Set up proper security practices (input validation, rate limiting, etc.)

Remember to secure your API endpoints and follow AWS and MongoDB best practices for security.
