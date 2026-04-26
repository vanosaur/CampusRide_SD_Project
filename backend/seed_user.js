const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config({ path: './backend/.env' });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campusride';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    passwordHash: String,
    isVerified: Boolean,
  });
  const User = mongoose.model('User', UserSchema);

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await User.findOneAndUpdate(
    { email: 'test@nst.rishihood.edu.in' },
    {
      name: 'Test Student',
      email: 'test@nst.rishihood.edu.in',
      passwordHash: hashedPassword,
      isVerified: true
    },
    { upsert: true, new: true }
  );

  console.log('User seeded:', user.email);
  await mongoose.disconnect();
}

seed().catch(console.error);
