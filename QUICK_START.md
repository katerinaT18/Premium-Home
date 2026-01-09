# Quick Start Guide

## Starting the Application

### 1. Start the Backend Server (Terminal 1)

```bash
cd backend
npm install  # Only needed first time
JWT_SECRET=premium-homes-secret-key-change-in-production PORT=5001 npm start
```

**Note:** Port 5000 is often used by macOS AirPlay Receiver, so we use port 5001 by default.

Or use the startup script:
```bash
cd backend
./start.sh
```

**Expected output:**
```
🚀 Premium Homes API server running on port 5000
📝 Environment: development
```

### 2. Start the Frontend (Terminal 2)

```bash
npm start
```

**Expected output:**
```
Compiled successfully!
You can now view premium-homes in the browser.
  Local:            http://localhost:3000
```

### 3. Test the Backend

Open a new terminal and test:
```bash
curl http://localhost:5001/api/health
```

You should see:
```json
{"status":"OK","message":"Premium Homes API is running"}
```

## Troubleshooting

### "Failed to fetch" Error

This means the backend server is not running or not accessible.

**Solution:**
1. Make sure the backend is running on port 5001 (default)
2. Check if port 5001 is available:
   ```bash
   lsof -i :5001
   ```
3. If port is in use, use a different port:
   ```bash
   PORT=3001 npm start
   ```
   Then update `src/services/api.js`:
   ```javascript
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
   ```

### Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

### Backend Not Starting

Check for errors in the terminal. Common issues:
- Missing dependencies: Run `npm install` in the backend folder
- Port already in use: Use a different port
- Missing environment variables: Set JWT_SECRET and PORT

## Development Tips

- Backend auto-reload: Use `npm run dev` instead of `npm start` in the backend folder
- Check browser console for detailed error messages
- Check network tab in browser DevTools to see API requests
