const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

async function fixDatabaseImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('aboutus');
    
    // The document ID from the API response
    const documentId = new ObjectId('68442bfca60a65ed61d4a309');
    
    console.log('🔍 Looking for document with ID:', documentId);
    
    // Find the specific document
    const doc = await collection.findOne({ _id: documentId });
    
    if (!doc) {
      console.log('❌ Document not found');
      return;
    }
    
    console.log('✅ Found document');
    console.log('📋 Current portfolio projects:');
    doc.portfolioSection.projects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title}: ${project.image}`);
    });
    
    // Update the image paths
    const updates = {
      'portfolioSection.projects.0.image': '/images/projects/Millennium Park.jpg',
      'portfolioSection.projects.1.image': '/images/projects/Millennium Business Hub.jpg',
      'portfolioSection.projects.2.image': '/images/projects/Laxmi Nova.jpg'
    };
    
    console.log('🔧 Updating image paths...');
    
    const result = await collection.updateOne(
      { _id: documentId },
      { $set: updates }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated image paths!');
      
      // Verify the update
      const updatedDoc = await collection.findOne({ _id: documentId });
      console.log('📋 Updated portfolio projects:');
      updatedDoc.portfolioSection.projects.forEach((project, index) => {
        console.log(`  ${index + 1}. ${project.title}: ${project.image}`);
      });
    } else {
      console.log('⚠️  No changes were made');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

fixDatabaseImages();
