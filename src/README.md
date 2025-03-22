
# Kalakriti Hub - Implementation Guide

This guide provides detailed steps for implementing MongoDB authentication and Amazon S3 file storage in your Kalakriti Hub application.

## MongoDB Authentication Integration

### Step 1: Set Up MongoDB Atlas

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (or use your existing account)
2. Create a new cluster (the free tier is sufficient to start)
3. Create a database user with password authentication
4. Whitelist your IP address (use `0.0.0.0/0` for development)
5. Get your connection string from the Atlas dashboard
6. Replace `<db_password>` with your actual database password in the connection string

### Step 2: Install Required Packages

```bash
npm install mongodb jsonwebtoken bcrypt
```

### Step 3: Set Environment Variables

For local development, you can use a `.env` file or set the environment variables in your deployment platform:

```
MONGODB_URI=mongodb+srv://kalakritievent64:<db_password>@cluster0.uvvzg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=kalakritievent64
JWT_SECRET=your_secure_jwt_secret_key
```

Replace `<db_password>` with your actual database password.

### Step 4: Use MongoDB in Your API Routes

The MongoDB connection utility is already implemented in `src/lib/mongoConfig.ts`. To use it in your API routes:

```typescript
import { connectToDatabase, COLLECTIONS } from '@/lib/mongoConfig';

export async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    
    // Example: Get all users
    const users = await db.collection(COLLECTIONS.USERS).find({}).toArray();
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Step 5: Implementing Backend Routes

For a React frontend with a separate backend (e.g., Express, Next.js API routes), you should:

1. Create API endpoints for authentication, CRUD operations
2. Secure routes with middleware
3. Connect to MongoDB in each route handler
4. Return appropriate responses

Example API structure:
```
/api
  /auth
    /login
    /signup
    /refresh-token
  /users
    /profile
    /update-profile
  /submissions
    /create
    /get-by-user
  /payments
    /create-order
    /verify-payment
```

## Amazon S3 Integration for File Storage

### Step 1: Set Up AWS Account and S3 Bucket

1. Create an AWS account if you don't already have one
2. Create an IAM user with programmatic access and S3 permissions
3. Note down the Access Key ID and Secret Access Key
4. Create an S3 bucket for storing uploads
5. Configure CORS for your bucket to allow uploads from your domain

### Step 2: Set S3 Environment Variables

```
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=your_region (e.g., ap-south-1)
S3_BUCKET_NAME=your_bucket_name
```

### Step 3: Implement File Upload Logic

The `s3Config.ts` utility is already implemented. To use it in your API routes:

```typescript
import { uploadToS3 } from '@/lib/s3Config';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongoConfig';

export async function uploadHandler(req, res) {
  try {
    // Parse form data with a library like formidable or multer
    const { fields, files } = await parseFormData(req);
    
    // Upload files to S3
    const fileUrls = await Promise.all(
      files.map(file => uploadToS3(file, `submissions/${fields.eventType}`))
    );
    
    // Save submission data to MongoDB
    const { db } = await connectToDatabase();
    const submission = {
      userId: fields.userId,
      eventType: fields.eventType,
      title: fields.title,
      description: fields.description,
      fileUrls,
      createdAt: new Date(),
      status: 'submitted'
    };
    
    const result = await db.collection(COLLECTIONS.SUBMISSIONS).insertOne(submission);
    
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
}
```

## Implementing Backend Authentication

### Step 1: Create JWT Authentication Functions

```typescript
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { connectToDatabase, COLLECTIONS } from '@/lib/mongoConfig';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_jwt_secret';

// Login user and generate JWT token
export async function loginUser(email: string, password: string) {
  const { db } = await connectToDatabase();
  
  // Find user by email
  const user = await db.collection(COLLECTIONS.USERS).findOne({ email });
  
  if (!user) {
    throw new Error('Invalid email or password');
  }
  
  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      contestantId: user.contestantId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      contestantId: user.contestantId || null
    }
  };
}

// Create new user account
export async function createUser(userData: any) {
  const { db } = await connectToDatabase();
  
  // Check if user already exists
  const existingUser = await db.collection(COLLECTIONS.USERS).findOne({ email: userData.email });
  
  if (existingUser) {
    throw new Error('Email already in use');
  }
  
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  // Create user
  const newUser = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection(COLLECTIONS.USERS).insertOne(newUser);
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: result.insertedId.toString(),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      contestantId: userData.contestantId || null
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  return {
    token,
    user: {
      id: result.insertedId.toString(),
      email: userData.email,
      name: `${userData.firstName} ${userData.lastName}`,
      contestantId: userData.contestantId || null
    }
  };
}

// Verify JWT token
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

## Next Steps

1. Implement backend API routes for all application features
2. Connect frontend components to API endpoints
3. Test authentication flow
4. Implement file uploads with S3
5. Set up payment processing with Razorpay

If you need any help with specific implementations, please let me know!
