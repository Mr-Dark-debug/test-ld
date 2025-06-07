const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkAwards() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const awards = await db.collection('awards').find({}).toArray();
    
    console.log('Current awards:');
    awards.forEach(award => {
      console.log(`- ${award.title}: ${award.image}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkAwards();
