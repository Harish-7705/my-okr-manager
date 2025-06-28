<<<<<<< HEAD
# MyOKR - OKR Management Application

A modern OKR (Objectives and Key Results) management application built with React, Firebase, and Node.js. This application helps organizations, departments, teams, and users track and manage their objectives effectively.

## 🚀 Features

### ✅ Core Requirements Implemented
- **User Authentication & Authorization**: Secure login/register with Firebase Auth
- **Hierarchy Management**: Organization > Departments > Teams > Users
- **Team OKR Assignment**: Assign OKRs to specific users
- **Full CRUD Operations**: Create, Read, Update, Delete OKRs
- **Progress Tracking**: Visual progress bars and percentage tracking

### 🎯 Additional Features
- **Role-based Access**: User, Team Lead, Manager, Admin roles
- **Progress History**: Track completed vs in-progress OKRs
- **Hierarchy Filtering**: Filter OKRs by organization, department, team
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Firebase Firestore for real-time data

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Backend**: Firebase (Authentication, Firestore Database)
- **Styling**: CSS3 with responsive design
- **Deployment**: Ready for Vercel, Netlify, or Firebase Hosting

## 📁 Project Structure

```
MY-OKR/
├── client/                 # React Frontend
│   ├── public/            # Static files
│   │   ├── components/    # React components
│   │   ├── firebase.js    # Firebase configuration
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── server/                # Node.js Backend (Optional)
│   ├── server.js          # Express server
│   └── package.json       # Backend dependencies
└── README.md              # Project documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd MY-OKR
```

### 2. Set Up Firebase
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Get your Firebase config

### 3. Configure Firebase
Update `client/src/firebase.js` with your Firebase project credentials:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Install Dependencies
```bash
cd client
npm install
```

### 5. Run the Application
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📱 Usage

### Registration
1. Click "Register" on the login page
2. Fill in your details (Name, Email, Password, Role)
3. Choose your role (User, Team Lead, Manager, Admin)

### Creating OKRs
1. Login to your account
2. Click "Add OKR" on the dashboard
3. Fill in the details:
   - Title
   - Organization
   - Department
   - Team
   - Assign to user
   - Description
   - Progress percentage
   - Status

### Managing OKRs
- **View**: Click on any OKR to see details
- **Edit**: Click "Edit" button on any OKR
- **Delete**: Click "Delete" button to remove OKRs
- **Filter**: Use the dropdown filters to view OKRs by hierarchy
- **Track Progress**: Update progress percentage and mark as completed

## 🚀 Deployment

### Option 1: Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Build the app: `npm run build`
3. Deploy: `vercel`

### Option 2: Netlify
1. Build the app: `npm run build`
2. Drag the `build` folder to Netlify
3. Configure environment variables if needed

### Option 3: Firebase Hosting
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the `client` directory:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

## 📊 Database Schema

### Users Collection
```javascript
{
  email: string,
  name: string,
  role: "user" | "team_lead" | "manager" | "admin",
  createdAt: timestamp
}
```

### OKRs Collection
```javascript
{
  title: string,
  description: string,
  organization: string,
  department: string,
  team: string,
  assignedTo: string,
  progress: number,
  status: "in-progress" | "completed",
  createdBy: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is created for educational purposes and internship assessment.

## 👨‍💻 Author

Created for ABEX Full Stack Developer Intern position.

---

**Note**: This application demonstrates modern web development practices using React and Firebase, suitable for internship assessments and learning purposes. 
=======
# my-okr-manager
>>>>>>> 1e71d59f795d1c4f0ff80ea76f7b464664bbc8c5
