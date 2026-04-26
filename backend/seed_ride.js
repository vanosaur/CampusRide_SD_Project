const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusride';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const UserSchema = new mongoose.Schema({ email: String });
  const User = mongoose.model('User', UserSchema);
  const user = await User.findOne({ email: 'test@nst.rishihood.edu.in' });

  const RideSchema = new mongoose.Schema({
    creatorId: mongoose.Schema.Types.ObjectId,
    destination: String,
    pickupLocation: String,
    date: String,
    departureTime: Date,
    maxSeats: Number,
    totalFare: Number,
    status: String,
  });
  const Ride = mongoose.model('Ride', RideSchema);

  const ride = await Ride.findOneAndUpdate(
    { destination: 'North Gate' },
    {
      creatorId: user._id,
      destination: 'North Gate',
      pickupLocation: 'Main Building',
      date: '2026-04-30',
      departureTime: new Date(),
      maxSeats: 4,
      totalFare: 200,
      status: 'OPEN'
    },
    { upsert: true, new: true }
  );

  console.log('Ride seeded:', ride.id);
  await mongoose.disconnect();
}

seed().catch(console.error);
