import { Firestore } from '@google-cloud/firestore';

const loadStoreData = async () => {
  const db = new Firestore({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: 'submissionmlgc-deisya',
    databaseId: 'predictions',
  });

  const predictCollection = db.collection('predictions');

  const snapshot = await predictCollection.orderBy('createdAt', 'desc').get();

  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    history: doc.data(),
  }));

  return { data };
};

export default loadStoreData;