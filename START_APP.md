# How to Start the Premium Homes Application

## Quick Start (Two Terminals Required)

### Terminal 1: Start Backend Server

```bash
cd backend
JWT_SECRET=premium-homes-secret-key-change-in-production PORT=5001 npm start
```

**Expected output:**
```
🚀 Premium Homes API server running on port 5001
📝 Environment: development
```

### Terminal 2: Start Frontend (React App)

```bash
npm start
```

**Expected output:**
```
Compiled successfully!

You can now view premium-homes in the browser.

  Local:            http://localhost:3000
```

## Accessing the Admin Login Page

Once both servers are running:

1. **Open your browser** and go to:
   ```
   http://localhost:3000/admin/login
   ```

2. **Login credentials:**
   - Username: `admin`
   - Password: `admin123`

3. **After login**, you'll be redirected to:
   ```
   http://localhost:3000/admin/dashboard
   ```

## Troubleshooting

### "This site can't be reached" or "localhost refused to connect"

**Problem:** The frontend React app is not running.

**Solution:**
1. Make sure you're in the project root directory
2. Run `npm start` in a terminal
3. Wait for "Compiled successfully!" message
4. Open `http://localhost:3000` in your browser

### "Failed to fetch" on login

**Problem:** The backend server is not running.

**Solution:**
1. Make sure the backend is running on port 5001
2. Test with: `curl http://localhost:5001/api/health`
3. Should return: `{"status":"OK","message":"Premium Homes API is running"}`

### Wrong Port

- **Frontend:** Always runs on port 3000
- **Backend:** Runs on port 5001 (default, to avoid macOS AirPlay conflict)

If you need to change the backend port, also update `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:YOUR_PORT/api';
```

## All Available Routes

- **Home:** `http://localhost:3000/`
- **Property Details:** `http://localhost:3000/property/:id`
- **Admin Login:** `http://localhost:3000/admin/login`
- **Admin Dashboard:** `http://localhost:3000/admin/dashboard` (requires login)
