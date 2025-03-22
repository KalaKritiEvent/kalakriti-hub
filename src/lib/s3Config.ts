
// Amazon S3 Configuration for File Storage
// Replace placeholder values with your actual AWS credentials

// For security, these values should be stored in environment variables
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || "YOUR_ACCESS_KEY_ID";
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || "YOUR_SECRET_ACCESS_KEY";
const AWS_REGION = process.env.AWS_REGION || "us-east-1";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "kalakriti-hub-uploads";

/*
 * Steps to set up Amazon S3:
 * 
 * 1. Create an AWS account if you don't have one (https://aws.amazon.com/)
 * 2. Create an IAM user with programmatic access and S3 permissions
 * 3. Note down the access key ID and secret access key
 * 4. Create an S3 bucket with appropriate permissions
 * 5. Set up CORS configuration for your bucket to allow uploads from your domain
 * 6. Install the AWS SDK: npm install aws-sdk
 * 7. Use the AWS SDK to interact with your S3 bucket
 *
 * Example S3 Upload Code:
 * 
 * import AWS from 'aws-sdk';
 * 
 * // Configure AWS
 * AWS.config.update({
 *   accessKeyId: AWS_ACCESS_KEY_ID,
 *   secretAccessKey: AWS_SECRET_ACCESS_KEY,
 *   region: AWS_REGION
 * });
 * 
 * const s3 = new AWS.S3();
 * 
 * export async function uploadFileToS3(file, customFileName) {
 *   const fileName = customFileName || `${Date.now()}-${file.name}`;
 *   
 *   const params = {
 *     Bucket: S3_BUCKET_NAME,
 *     Key: fileName,
 *     Body: file,
 *     ContentType: file.type,
 *     ACL: 'public-read'  // Make sure your bucket allows this
 *   };
 * 
 *   try {
 *     const { Location } = await s3.upload(params).promise();
 *     return Location;  // Returns the URL of the uploaded file
 *   } catch (error) {
 *     console.error('Error uploading file:', error);
 *     throw error;
 *   }
 * }
 * 
 * // Example CORS Configuration for your S3 Bucket:
 * // [
 * //   {
 * //     "AllowedHeaders": ["*"],
 * //     "AllowedMethods": ["GET", "POST", "PUT"],
 * //     "AllowedOrigins": ["https://yourdomain.com"],
 * //     "ExposeHeaders": [],
 * //     "MaxAgeSeconds": 3000
 * //   }
 * // ]
 */

// File size limits and allowed types
const FILE_UPLOAD_CONFIG = {
  maxSizeInBytes: 10 * 1024 * 1024, // 10 MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  allowedVideoTypes: ['video/mp4', 'video/quicktime', 'video/avi']
};

export { 
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  S3_BUCKET_NAME,
  FILE_UPLOAD_CONFIG
};
