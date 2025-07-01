const { MongoClient, ObjectId } = require('mongodb');

// Use the MongoDB URI directly
const MONGODB_URI = 'mongodb://localhost:27017/laxmidev';

async function updateImagePaths() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('aboutus');
    
    // Find the document
    const doc = await collection.findOne({});
    
    if (!doc) {
      console.log('No document found');
      return;
    }
    
    console.log('Found document with ID:', doc._id);
    
    // Update the image paths
    const result = await collection.updateOne(
      { _id: doc._id },
      {
        $set: {
          'portfolioSection.projects.0.image': '/images/projects/Millennium Park.jpg',
          'portfolioSection.projects.1.image': '/images/projects/Millennium Business Hub.jpg',
          'portfolioSection.projects.2.image': '/images/projects/Laxmi Nova.jpg'
        }
      }
    );
    
    console.log('Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('Successfully updated image paths!');
    } else {
      console.log('No changes made');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateImagePaths();
