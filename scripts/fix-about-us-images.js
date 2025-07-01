const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is not set');
  process.exit(1);
}

async function fixAboutUsImages() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('🔗 Connected to MongoDB');
    
    const db = client.db();
    const aboutUsCollection = db.collection('aboutuses');
    
    // Find all AboutUs documents
    const aboutUsDocuments = await aboutUsCollection.find({}).toArray();
    console.log(`📄 Found ${aboutUsDocuments.length} AboutUs documents`);

    if (aboutUsDocuments.length === 0) {
      console.log('ℹ️  No AboutUs documents found in database. This means the API is using default content.');
      console.log('🔍 Let me check if there are documents in the "aboutuses" collection...');

      // Try different collection name variations
      const collections = await db.listCollections().toArray();
      console.log('📋 Available collections:', collections.map(c => c.name));

      // Check if there's an "aboutuses" collection (mongoose pluralizes collection names)
      const aboutUsesCollection = db.collection('aboutuses');
      const aboutUsesDocuments = await aboutUsesCollection.find({}).toArray();
      console.log(`📄 Found ${aboutUsesDocuments.length} documents in "aboutuses" collection`);

      if (aboutUsesDocuments.length > 0) {
        console.log('🎯 Found documents in "aboutuses" collection. Processing those...');
        aboutUsDocuments.push(...aboutUsesDocuments);
      }
    }
    
    for (const doc of aboutUsDocuments) {
      let needsUpdate = false;
      const updates = {};
      
      // Check and fix portfolio section project images
      if (doc.portfolioSection && doc.portfolioSection.projects) {
        const fixedProjects = doc.portfolioSection.projects.map(project => {
          let fixedProject = { ...project };
          
          // Fix image paths by adding spaces
          if (project.image) {
            const originalImage = project.image;
            let fixedImage = originalImage;
            
            // Fix specific image paths
            if (originalImage.includes('MillenniumPark.jpg')) {
              fixedImage = originalImage.replace('MillenniumPark.jpg', 'Millennium Park.jpg');
            }
            if (originalImage.includes('MillenniumBusinessHub.jpg')) {
              fixedImage = originalImage.replace('MillenniumBusinessHub.jpg', 'Millennium Business Hub.jpg');
            }
            if (originalImage.includes('LaxmiNova.jpg')) {
              fixedImage = originalImage.replace('LaxmiNova.jpg', 'Laxmi Nova.jpg');
            }
            
            if (fixedImage !== originalImage) {
              console.log(`🔧 Fixing image path: ${originalImage} → ${fixedImage}`);
              fixedProject.image = fixedImage;
              needsUpdate = true;
            }
          }
          
          return fixedProject;
        });
        
        if (needsUpdate) {
          updates['portfolioSection.projects'] = fixedProjects;
        }
      }
      
      // Update the document if needed
      if (needsUpdate) {
        // Try updating in both possible collections
        let result = await aboutUsCollection.updateOne(
          { _id: doc._id },
          { $set: updates }
        );

        if (result.matchedCount === 0) {
          // Try the "aboutuses" collection
          const aboutUsesCollection = db.collection('aboutuses');
          result = await aboutUsesCollection.updateOne(
            { _id: doc._id },
            { $set: updates }
          );
        }

        if (result.modifiedCount > 0) {
          console.log(`✅ Updated AboutUs document: ${doc._id}`);
        } else {
          console.log(`⚠️  No changes made to AboutUs document: ${doc._id}`);
        }
      } else {
        console.log(`✓ AboutUs document already has correct image paths: ${doc._id}`);
      }
    }
    
    console.log('🎉 AboutUs image path fixing completed!');
    
  } catch (error) {
    console.error('❌ Error fixing AboutUs images:', error);
  } finally {
    await client.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the script
fixAboutUsImages();
