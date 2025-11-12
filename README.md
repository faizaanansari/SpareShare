# SpareShare - Share What You Spare. Care Where It Counts.

A comprehensive donation platform connecting donors with verified NGOs to donate food, clothes, and books to those in need.

## Features

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control
- Three user roles: Donor, NGO, and Admin
- Secure password hashing with bcrypt
- Protected routes with ownership validation

### 👥 User Management
- **Donors**: Create donations, track impact, manage listings
- **NGOs**: Browse nearby donations, claim items, requires admin approval
- **Admins**: Approve NGOs, moderate content, view analytics

### 📦 Donation System
- Create donations with detailed information (type, quantity, location, urgency)
- Real-time status tracking (available, claimed, completed)
- Location-based matching for efficient pickup
- Expiry date tracking for food items
- Pickup instructions and donor contact information

### 🗺️ Location Features
- Google Maps integration for address autocomplete
- Proximity-based donation discovery
- Coordinate storage for accurate location matching

### 📊 Analytics & Reporting
- Real-time dashboard statistics
- Impact tracking for donors and NGOs
- Admin oversight with comprehensive metrics

## Tech Stack

### Frontend
- **React** with TypeScript
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API communication
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** for cross-origin requests

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd spareshare-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```bash
cp .env.sample .env
```

Update the `.env` file with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/spareshare
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
PORT=5000
ADMIN_EMAIL=admin@spareshare.com
ADMIN_PASSWORD=admin123
```

### 4. Start MongoDB
Make sure MongoDB is running on your system.

### 5. Run the Application
```bash
npm run dev
```

This will start both the frontend (port 5173) and backend (port 5000) concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Donations
- `POST /api/donations` - Create donation (donors only)
- `GET /api/donations/user` - Get user's donations
- `GET /api/donations/nearby` - Get nearby donations (NGOs only)
- `PUT /api/donations/:id` - Update donation
- `DELETE /api/donations/:id` - Delete donation
- `POST /api/donations/:id/claim` - Claim donation (NGOs only)

### NGOs
- `GET /api/ngos` - Get all NGOs (admin only)
- `PUT /api/ngos/:id/approve` - Approve NGO (admin only)
- `PUT /api/ngos/:id/reject` - Reject NGO (admin only)

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics (admin only)

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String,
  password: String,
  role: ['donor', 'ngo', 'admin'],
  phone: String,
  address: String,
  coordinates: { lat: Number, lng: Number },
  // NGO specific fields
  organizationName: String,
  registrationNumber: String,
  isApproved: Boolean,
  // Stats
  totalDonations: Number,
  totalReceived: Number
}
```

### Donation Model
```javascript
{
  title: String,
  description: String,
  type: ['food', 'clothes', 'books'],
  quantity: Number,
  unit: String,
  condition: ['new', 'good', 'fair'],
  location: String,
  coordinates: { lat: Number, lng: Number },
  createdBy: ObjectId,
  claimedBy: ObjectId,
  status: ['available', 'claimed', 'completed', 'expired'],
  urgency: ['low', 'medium', 'high'],
  expiryDate: Date,
  pickupInstructions: String
}
```

## Security Features

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control

### Data Protection
- User ownership validation
- Protected routes with middleware
- Input sanitization and validation

### API Security
- CORS configuration
- Error handling middleware
- Request rate limiting (recommended for production)

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend (Render/Railway)
1. Set environment variables in your hosting service
2. Deploy the server code
3. Ensure MongoDB connection is configured

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Update the `MONGODB_URI` in your environment variables
3. Configure network access and database users

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please contact [support@spareshare.com] or create an issue in the repository.

## Future Enhancements

- [ ] Real-time notifications
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] Integration with delivery services
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Payment processing for logistics
- [ ] AI-powered donation matching