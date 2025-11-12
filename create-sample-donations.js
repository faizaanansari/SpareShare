import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Donation from './server/models/Donation.js';
import User from './server/models/User.js';

dotenv.config();

const createSampleDonations = async () => {
  try {
    console.log('🔄 Creating sample donations...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spareshare';
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Find or create a donor user
    let donor = await User.findOne({ role: 'donor' });
    if (!donor) {
      donor = await User.create({
        name: 'Sample Donor',
        email: 'donor@example.com',
        password: 'password123',
        role: 'donor',
        phone: '+1234567890',
        address: 'New York, NY'
      });
      console.log('✅ Created sample donor user');
    } else {
      console.log('ℹ️  Using existing donor user:', donor.email);
    }
    
    // Sample donations with different locations
    const sampleDonations = [
      {
        title: 'Fresh Vegetables and Fruits',
        description: 'Assorted fresh vegetables and fruits from our garden. Perfect for families in need.',
        type: 'food',
        quantity: 20,
        unit: 'kg',
        condition: 'good',
        location: 'Manhattan, New York, NY',
        coordinates: { lat: 40.7831, lng: -73.9712 },
        urgency: 'high',
        expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        pickupInstructions: 'Available for pickup between 9 AM - 6 PM. Ring apartment 4B.',
        createdBy: donor._id,
        status: 'available'
      },
      {
        title: 'Winter Clothing Collection',
        description: 'Warm winter clothes including jackets, sweaters, and blankets. All in good condition.',
        type: 'clothes',
        quantity: 15,
        unit: 'pieces',
        condition: 'good',
        location: 'Brooklyn, New York, NY',
        coordinates: { lat: 40.6782, lng: -73.9442 },
        urgency: 'medium',
        pickupInstructions: 'Contact me 30 minutes before pickup. Available weekends.',
        createdBy: donor._id,
        status: 'available'
      },
      {
        title: 'Educational Books for Children',
        description: 'Collection of educational books suitable for children ages 5-12. Includes storybooks and textbooks.',
        type: 'books',
        quantity: 50,
        unit: 'books',
        condition: 'good',
        location: 'Queens, New York, NY',
        coordinates: { lat: 40.7282, lng: -73.7949 },
        urgency: 'low',
        pickupInstructions: 'Books are packed in boxes. Please bring a vehicle for transport.',
        createdBy: donor._id,
        status: 'available'
      },
      {
        title: 'Canned Food Items',
        description: 'Various canned food items with long shelf life. Great for food banks.',
        type: 'food',
        quantity: 30,
        unit: 'cans',
        condition: 'new',
        location: 'Bronx, New York, NY',
        coordinates: { lat: 40.8448, lng: -73.8648 },
        urgency: 'medium',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
        pickupInstructions: 'Available for pickup Monday to Friday, 10 AM - 4 PM.',
        createdBy: donor._id,
        status: 'available'
      },
      {
        title: 'Office Supplies and Stationery',
        description: 'Unused office supplies including notebooks, pens, folders, and paper.',
        type: 'books',
        quantity: 100,
        unit: 'items',
        condition: 'new',
        location: 'Staten Island, New York, NY',
        coordinates: { lat: 40.5795, lng: -74.1502 },
        urgency: 'low',
        pickupInstructions: 'Large quantity - please coordinate pickup time in advance.',
        createdBy: donor._id,
        status: 'available'
      }
    ];
    
    // Check if donations already exist
    const existingCount = await Donation.countDocuments({ createdBy: donor._id });
    if (existingCount > 0) {
      console.log(`ℹ️  Found ${existingCount} existing donations for this donor`);
      console.log('Skipping sample donation creation to avoid duplicates');
    } else {
      // Create sample donations
      const createdDonations = await Donation.insertMany(sampleDonations);
      console.log(`✅ Created ${createdDonations.length} sample donations`);
      
      // Update donor's total donations count
      await User.findByIdAndUpdate(donor._id, {
        $inc: { totalDonations: createdDonations.length }
      });
      console.log('✅ Updated donor statistics');
    }
    
    // Display current donation stats
    const totalDonations = await Donation.countDocuments();
    const availableDonations = await Donation.countDocuments({ status: 'available' });
    
    console.log('\n📊 Current Database Stats:');
    console.log(`   Total Donations: ${totalDonations}`);
    console.log(`   Available Donations: ${availableDonations}`);
    
    // Test geospatial query
    console.log('\n🧪 Testing geospatial query for NGOs...');
    const nearbyDonations = await Donation.find({
      status: 'available',
      coordinates: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [-73.9712, 40.7831] // Manhattan coordinates
          },
          $maxDistance: 50000 // 50km radius
        }
      }
    }).limit(10);
    
    console.log(`✅ Found ${nearbyDonations.length} donations within 50km of Manhattan`);
    nearbyDonations.forEach(donation => {
      console.log(`   - ${donation.title} (${donation.type}) at ${donation.location}`);
    });
    
    console.log('\n🎉 Sample donations setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error creating sample donations:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

createSampleDonations();
