# Architecture Overview - Premium Homes

## Current Architecture (No Backend)

### How It Works Now

The application currently works **entirely on the client-side** using:

1. **Redux Store** - In-memory state management
   - Properties are stored in Redux state
   - Changes are immediate and visible
   - **Problem**: Data is lost on page refresh

2. **localStorage** - Browser storage
   - Currently used for: Admin authentication
   - **Not used for**: Properties (yet)

3. **Sample Data** - Hardcoded properties
   - Located in `src/data/sampleProperties.js`
   - Loaded on app startup via Redux Saga

4. **Redux Saga** - Simulates API calls
   - Currently returns sample data
   - Ready to be replaced with real API calls

### Data Flow

```
App Start → Redux Saga → Sample Data → Redux Store → Components
```

### Current Limitations

1. **No Persistence**: Property changes are lost on page refresh
2. **Single User**: No multi-user support
3. **No Real API**: All data is client-side only
4. **No Image Storage**: Uploaded images stored as base64 (large size)

---

## Solution: Adding localStorage Persistence

I'll add localStorage persistence so:
- ✅ Property changes persist across page refreshes
- ✅ Admin can manage properties without losing data
- ✅ Works offline
- ✅ Easy migration path to backend later

---

## Future: Backend Integration

When you're ready to add a backend, you'll need:

### Backend Requirements

1. **REST API** or **GraphQL** endpoints:
   - `GET /api/properties` - Fetch all properties
   - `GET /api/properties/:id` - Get single property
   - `POST /api/properties` - Create property
   - `PUT /api/properties/:id` - Update property
   - `DELETE /api/properties/:id` - Delete property
   - `POST /api/auth/login` - Admin login
   - `POST /api/upload` - Image upload

2. **Database** (PostgreSQL, MongoDB, etc.)
   - Store properties
   - Store admin users
   - Store images (or use cloud storage like AWS S3)

3. **Authentication**
   - JWT tokens
   - Session management
   - Password hashing

### Migration Path

The code is already structured for easy backend integration:

1. **Replace Saga API calls** in `propertiesSaga.js`:
   ```javascript
   // Current (simulated)
   const fetchPropertiesApi = async () => {
     return sampleProperties;
   };
   
   // Future (real API)
   const fetchPropertiesApi = async () => {
     const response = await fetch('/api/properties');
     return response.json();
   };
   ```

2. **Update Redux actions** - No changes needed! Actions stay the same.

3. **Add API service layer** - Create `src/services/api.js` for API calls.

---

## Recommended Backend Technologies

- **Node.js + Express** - Easy to integrate with React
- **Python + Django/FastAPI** - Powerful and flexible
- **Firebase** - Quick setup, handles auth & storage
- **Supabase** - Open-source Firebase alternative

---

## Next Steps

1. ✅ Add localStorage persistence (I'll do this now)
2. Later: Build backend API
3. Later: Replace localStorage with API calls
4. Later: Add image upload to cloud storage
