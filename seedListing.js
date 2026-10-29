require("dotenv").config();

const mongoose = require("mongoose");
const Listing = require("./models/listing");
const User = require("./models/user");
const initData = require("./init/data");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const dbUrl = process.env.ATLASDB_URL;

async function seedDB() {
  await Listing.deleteMany({});

 const owner = await User.findOne({ username: "ankush" });

if (!owner) {
  throw new Error(
    'Owner "ankush" not found. Create or verify the user in Atlas first.'
  );
}

  const listingsWithOwner = [];
  for (let obj of initData.data) {
    const response = await geocodingClient
      .forwardGeocode({
        query: `${obj.location}, ${obj.country}`,
        limit: 1,
      })
      .send();

    console.log(`${obj.location} ->`, response.body.features[0].geometry.coordinates);

    listingsWithOwner.push({
      ...obj,
      owner: owner._id,
      geometry: response.body.features[0].geometry,
    });
  }

  await Listing.insertMany(listingsWithOwner);

  console.log("All listings seeded successfully!");
  mongoose.connection.close();
}

mongoose
  .connect(dbUrl)
  .then(async () => {
    console.log("Connected to DB");
    await seedDB();
  })
  .catch(console.error);