import formidable from 'formidable';
import inferenceService from '../services/inferenceService.js';
import storeData from '../services/storeData.js';

export const predictHandler = async (request, h) => {
  const form = new formidable.IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(request.raw.req, async (err, fields, files) => {
      if (err) {
        return reject(h.response({
          status: 'error',
          message: 'Terjadi kesalahan saat mengunggah file',
        }).code(500));
      }

      try {
        const { id, createdAt } = fields;
        const image = files.image.filepath; // Pastikan ini sesuai dengan nama field di Postman

        const model = request.server.app.model;
        const { label, confidenceScore, suggestion } = await inferenceService.predictBinaryClassificationCancer(model, image);

        const data = {
          id,
          result: label,
          suggestion,
          createdAt,
        };

        await storeData(id, data);

        resolve(h.response({
          status: 'success',
          message: confidenceScore >= 100 || confidenceScore < 1
            ? 'Model is predicted successfully'
            : 'Model is predicted successfully but under threshold. Please use the correct picture',
          data,
        }).code(201));
      } catch (error) {
        reject(h.response({
          status: 'error',
          message: 'Terjadi kesalahan saat melakukan prediksi',
        }).code(500));
      }
    });
  });
};

export const notFoundHandler = (request, h) => {
  return h.response({
    status: 'fail',
    message: 'Endpoint tidak ditemukan',
  }).code(404);
};