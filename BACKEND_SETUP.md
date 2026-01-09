# Backend API Setup Guide

## Quick Start

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend Server

**Option 1: Using the startup script (recommended)**
```bash
./start.sh
```

**Option 2: Using npm directly**
```bash
JWT_SECRET=premium-homes-secret-key-change-in-production PORT=5001 npm start
```

**Option 3: Using nodemon for development (auto-restart on changes)**
```bash
JWT_SECRET=premium-homes-secret-key-change-in-production PORT=5001 npm run dev
```

**Note:** Port 5000 is often used by macOS AirPlay Receiver. The default is now port 5001. If you need a different port:
```bash
PORT=3001 npm start
```
Then update `src/services/api.js` to match the port.

The API will run on `http://localhost:5001` (or the port you specify)

### 3. Update Frontend to Use API

The frontend is already configured to use the API! Just make sure:

1. Backend is running on port 5000
2. Frontend is running on port 3000
3. CORS is enabled (already configured)

## API Endpoints

### Public Endpoints

- `GET /api/health` - Health check
- `GET /api/properties` - Get all properties
- `GET /api/properties/:id` - Get single property

### Admin Endpoints (Require JWT Token)

- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

## How It Works

1. **Data Storage**: Uses JSON files in `backend/data/`
   - `properties.json` - All properties
   - `admin.json` - Admin user

2. **Image Storage**: Uploaded images stored in `backend/uploads/`
   - Accessible via `/uploads/filename.jpg`

3. **Authentication**: JWT tokens
   - Tokens expire after 7 days
   - Stored in frontend localStorage

## Testing the API

You can test the API using:

```bash
# Health check
curl http://localhost:5000/api/health

# Get properties
curl http://localhost:5000/api/properties

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

## Production Deployment

1. Change `JWT_SECRET` in `.env` to a secure random string
2. Change default admin password
3. Use a real database (PostgreSQL, MongoDB, etc.)
4. Use cloud storage for images (AWS S3, Cloudinary, etc.)
5. Set up proper CORS for your domain
6. Use environment variables for all secrets
