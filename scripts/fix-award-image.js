const { MongoClient } = require('mongodb');
require('dotenv').config();

async function fixAwardImage() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const awards = db.collection('awards');
    
    // Find the award with the problematic image
    const award = await awards.findOne({
      image: { $regex: 'pixabay.com' }
    });
    
    if (award) {
      console.log('Found award with Pixabay image:', award.title);
      
      // Update with a working image URL
      const result = await awards.updateOne(
        { _id: award._id },
        { 
          $set: { 
            image: '/images/awards/best-developer-2023.jpg'
          }
        }
      );
      
      console.log('Updated award image:', result.modifiedCount, 'documents modified');
    } else {
      console.log('No award found with Pixabay image');
    }
    
    // List all awards
    const allAwards = await awards.find({}).toArray();
    console.log('\nAll awards:');
    allAwards.forEach(award => {
      console.log(`- ${award.title}: ${award.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

fixAwardImage();
