import * as tf from '@tensorflow/tfjs-node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const loadModel = async () => {
  const modelPath = process.env.MODEL_URL || join(__dirname, '../models/model.json');
  if (!modelPath) {
    throw new Error('modelUrl in loadGraphModel() cannot be null. Please provide a url or an IOHandler that loads the model');
  }
  const model = await tf.loadGraphModel(`file://${modelPath}`);
  return model;
};

export default loadModel;