import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    console.log('🔄 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Found in .env' : 'Using default');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spareshare';
    
    // Hide sensitive parts of the connection string for logging
    const safeURI = mongoURI.replace(/:([^:@]+)@/, ':****@');
    console.log('Connecting to:', safeURI);
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database:', conn.connection.db.databaseName);
    console.log('Host:', conn.connection.host);
    console.log('Port:', conn.connection.port);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await mongoose.connection.close();
    console.log('🔌 Connection closed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:');
    console.error('Error:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure MongoDB is running locally (if using local connection)');
      console.log('2. Check if MongoDB Atlas connection string is correct');
      console.log('3. Verify your IP is whitelisted in MongoDB Atlas');
      console.log('4. Check your internet connection');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Authentication issue:');
      console.log('1. Check username and password in connection string');
      console.log('2. Verify database user permissions');
    }
    
    process.exit(1);
  }
};

testConnection();
