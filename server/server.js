const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin (you'll need to add your service account key)
// For now, we'll use a placeholder - you'll need to get this from Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Routes

// Get all OKRs
app.get('/api/okrs', async (req, res) => {
  try {
    const okrsRef = db.collection('okrs');
    const snapshot = await okrsRef.get();
    const okrs = [];
    snapshot.forEach(doc => {
      okrs.push({ id: doc.id, ...doc.data() });
    });
    res.json(okrs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new OKR
app.post('/api/okrs', async (req, res) => {
  try {
    const { title, description, progress, status } = req.body;
    const okrData = {
      title,
      description,
      progress: progress || 0,
      status: status || 'in-progress',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('okrs').add(okrData);
    res.json({ id: docRef.id, ...okrData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update OKR
app.put('/api/okrs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, progress, status } = req.body;
    
    await db.collection('okrs').doc(id).update({
      title,
      description,
      progress,
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({ message: 'OKR updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete OKR
app.delete('/api/okrs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection('okrs').doc(id).delete();
    res.json({ message: 'OKR deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 