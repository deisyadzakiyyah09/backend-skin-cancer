const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./ServiceAccountKey.json');
const app = express();
const PORT = process.env.PORT || 3000;

// Inisialisasi Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://<project-id>.firebaseio.com" // Ganti dengan ID proyek kamu
});

// Gunakan file routes/predict.js
const predictRoute = require('./routes/predict');
app.use('/', predictRoute); // Semua endpoint di predict.js aktif di root URL

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});