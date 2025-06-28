# MyOKR Backend Server

This is a simple Node.js/Express backend for the MyOKR application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Get Firebase Service Account Key
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Rename it to `serviceAccountKey.json` and place it in the `server` folder

### 3. Run the Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

- `GET /api/okrs` - Get all OKRs
- `POST /api/okrs` - Create new OKR
- `PUT /api/okrs/:id` - Update OKR
- `DELETE /api/okrs/:id` - Delete OKR
- `GET /api/health` - Health check

## Note
Currently, your frontend is using Firebase directly. To use this backend instead, you would need to modify the frontend to make API calls to these endpoints instead of using Firebase SDK directly. 