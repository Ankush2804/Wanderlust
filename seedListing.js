const mongoose = require("mongoose");
const Listing = require("./models/listing");
require('dotenv').config();

const dbUrl = process.env.ATLASDB_URL || "mongodb://localhost:27017/wanderlust";

mongoose.connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

const seedListings = [
  {
    title: "Cozy Beach Cottage",
    category: "Beach",
    description: "A beautiful beachfront getaway",
    price: 100,
    geometry: { type: "Point", coordinates: [-122.4194, 37.7749] } // example coords
  },
  {
    title: "Mountain Cabin Retreat",
    category: "Mountains",
    description: "Escape to the mountains",
    price: 120,
    geometry: { type: "Point", coordinates: [-106.4454, 39.5501] }
  },
  {
    title: "Iconic City Apartment",
    category: "Iconic cities",
    description: "Stay in the heart of the city",
    price: 150,
    geometry: { type: "Point", coordinates: [-0.1276, 51.5074] }
  },
  {
    title: "Castle Stay",
    category: "Castles",
    description: "Live like royalty",
    price: 200,
    geometry: { type: "Point", coordinates: [2.3522, 48.8566] }
  },
  {
    title: "Amazing Pool Villa",
    category: "Amazing pools",
    description: "Luxury villa with pool",
    price: 180,
    geometry: { type: "Point", coordinates: [151.2093, -33.8688] }
  },
];

async function seedDB() {
  await Listing.deleteMany({});
  await Listing.insertMany(seedListings);
  console.log("Database seeded!");
  mongoose.connection.close();
}

seedDB();

