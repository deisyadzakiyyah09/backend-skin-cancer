const express = require('express');
const router = express.Router();
const multer = require('multer');
const tf = require('@tensorflow/tfjs-node');
const admin = require('firebase-admin');
const path = require('path');

// Konfigurasi multer untuk upload gambar
const upload = multer({ storage: multer.memoryStorage() });

// Load model
let model;
async function loadModel() {
    if (!model) {
        const modelPath = path.join(__dirname, '../models/tfjs_model/model.json');
        model = await tf.loadLayersModel(`file://${modelPath}`);
        console.log('Model berhasil dimuat!');
    }
    return model;
}

// Endpoint /predict
router.post('/predict', upload.single('image'), async (req, res) => {
    try {
        await loadModel();

        const imageBuffer = Buffer.from(req.file.buffer);
        const imageTensor = tf.node.decodeImage(imageBuffer, 3)
            .resizeNearestNeighbor([224, 224])
            .expandDims(0)
            .toFloat()
            .div(255);

        const prediction = model.predict(imageTensor);
        const probabilities = prediction.arraySync()[0];
        const result = probabilities[0] > 0.5 ? 'Cancer' : 'Non-cancer';
        const suggestion = result === 'Cancer' ? 'Segera periksa ke dokter' : 'Tidak ada masalah';

        const docRef = admin.firestore().collection('predictions').doc();
        await docRef.set({
            id: docRef.id,
            result: result,
            suggestion: suggestion,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).json({ status: 'success', result, suggestion });
    } catch (error) {
        console.error('Error prediksi:', error);
        res.status(500).json({ status: 'error', message: 'Gagal melakukan prediksi' });
    }
});

module.exports = router;