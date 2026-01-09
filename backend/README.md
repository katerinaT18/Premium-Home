# Premium Homes Backend API

RESTful API backend for Premium Homes real estate application.

## Features

- 🔐 JWT Authentication for admin
- 🏠 Property CRUD operations
- 📸 Image upload handling
- 💾 JSON file-based storage (easy to migrate to database)
- 🔒 Protected admin routes
- 🌐 CORS enabled for frontend

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update if needed:

```bash
cp .env.example .env
```

Default values:
- `PORT=5000`
- `JWT_SECRET=premium-homes-secret-key-2024-change-in-production`
- `NODE_ENV=development`

### 3. Start Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Public Endpoints

#### Health Check
```
GET /api/health
```

#### Get All Properties
```
GET /api/properties
```

#### Get Property by ID
```
GET /api/properties/:id
```

### Admin Endpoints (Require Authentication)

#### Login
```
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "token": "...", "user": {...} }
```

#### Verify Token
```
GET /api/auth/verify
Headers: { "Authorization": "Bearer <token>" }
```

#### Create Property
```
POST /api/properties
Headers: { "Authorization": "Bearer <token>" }
Body: { property data }
```

#### Update Property
```
PUT /api/properties/:id
Headers: { "Authorization": "Bearer <token>" }
Body: { property data }
```

#### Delete Property
```
DELETE /api/properties/:id
Headers: { "Authorization": "Bearer <token>" }
```

#### Upload Image
```
POST /api/upload/image
Headers: { "Authorization": "Bearer <token>" }
Body: FormData with "image" field
```

#### Upload Multiple Images
```
POST /api/upload/images
Headers: { "Authorization": "Bearer <token>" }
Body: FormData with "images" field (array)
```

## Default Admin Credentials

- **Username**: `admin`
- **Password**: `admin123`

⚠️ **Change these in production!**

## Data Storage

Currently uses JSON files:
- `data/properties.json` - All properties
- `data/admin.json` - Admin user data
- `uploads/` - Uploaded images

## Migration to Database

To migrate to a real database (PostgreSQL, MongoDB, etc.):

1. Replace functions in `data/database.js` with database queries
2. Update connection strings in `.env`
3. Install database driver (e.g., `pg`, `mongoose`)

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React dev server)
- Any origin (can be restricted in production)

## Security Notes

- JWT tokens expire after 7 days
- Passwords are hashed with bcrypt
- File uploads limited to 10MB
- Only image files accepted
- Admin routes protected with authentication middleware
