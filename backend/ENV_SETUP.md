# ResearchHub Backend - Environment Setup

## Setting up Environment Variables

This project uses environment variables to keep sensitive credentials secure.

### Setup Instructions

1. **Copy the example environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and add your credentials:**
   ```env
   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string_here
   MONGODB_DATABASE=your_database_name

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Never commit the `.env` file:**
   - The `.env` file is already in `.gitignore`
   - Only commit `.env.example` as a template

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `MONGODB_DATABASE` | MongoDB database name | `fsProject` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret_key` |

### Running the Application

After setting up your `.env` file:

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# Or on Windows
mvnw.cmd spring-boot:run
```

The application will automatically load environment variables from the `.env` file.

## Security Notes

- ⚠️ **Never commit your `.env` file to Git**
- ✅ Always use `.env.example` as a template for other developers
- 🔒 Keep your credentials secure and rotate them regularly
