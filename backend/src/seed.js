/**
 * Seed script to create an admin user.
 * Usage: node src/seed.js
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const config = require('./config');

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@taskflow.com' });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    await User.create({
      name: 'Admin',
      email: 'admin@taskflow.com',
      password: 'admin123',
      role: 'admin',
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@taskflow.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
