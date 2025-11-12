import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donation from './server/models/Donation.js';

dotenv.config();

const setupIndexes = async () => {
  try {
    console.log('🔄 Setting up database indexes...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spareshare';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Check existing indexes
    const existingIndexes = await Donation.collection.getIndexes();
    console.log('📋 Existing indexes:', Object.keys(existingIndexes));
    
    // Create 2dsphere index for geospatial queries
    try {
      await Donation.collection.createIndex({ coordinates: '2dsphere' });
      console.log('✅ Created 2dsphere index on coordinates field');
    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('ℹ️  2dsphere index already exists');
      } else {
        console.error('❌ Failed to create 2dsphere index:', indexError.message);
      }
    }
    
    // Create other useful indexes
    try {
      await Donation.collection.createIndex({ status: 1 });
      console.log('✅ Created index on status field');
    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('ℹ️  Status index already exists');
      } else {
        console.error('❌ Failed to create status index:', indexError.message);
      }
    }
    
    try {
      await Donation.collection.createIndex({ type: 1 });
      console.log('✅ Created index on type field');
    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('ℹ️  Type index already exists');
      } else {
        console.error('❌ Failed to create type index:', indexError.message);
      }
    }
    
    try {
      await Donation.collection.createIndex({ createdAt: -1 });
      console.log('✅ Created index on createdAt field');
    } catch (indexError) {
      if (indexError.message.includes('already exists')) {
        console.log('ℹ️  CreatedAt index already exists');
      } else {
        console.error('❌ Failed to create createdAt index:', indexError.message);
      }
    }
    
    // Verify indexes were created
    const updatedIndexes = await Donation.collection.getIndexes();
    console.log('📋 Final indexes:', Object.keys(updatedIndexes));
    
    // Test geospatial query
    console.log('🧪 Testing geospatial query...');
    const testQuery = {
      status: 'available',
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-74.0060, 40.7128] // NYC coordinates
          },
          $maxDistance: 50000 // 50km
        }
      }
    };
    
    const testResults = await Donation.find(testQuery).limit(5);
    console.log(`✅ Geospatial query test successful, found ${testResults.length} results`);
    
    console.log('🎉 Database indexes setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up indexes:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

setupIndexes();
