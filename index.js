const express = require('express');
const moment = require('moment');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// console.log() // remove this after you've confirmed it is working
// console.log() // remove this after you've confirmed it is working

// =======================================================================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y99g30k.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// 100. Middleware (ja amra nijera banabo)
const logger = async (req, res, next) => {
  // console.log('called', req.host , req.originalUrl);
  console.log('Log: info -> ', req.method, req.url);
  next();
}

// 101. Verify Token
const verifyToken = async (req, res, next) => {
  const token = req?.cookies?.token;
  console.log('Value of token in Middleware: ', token);
  // No token available
  if (!token) {
    return res.status(401).send({ message: 'unauthorized access' })
  }
  // Here is jwt is checking whether the token is expired or valid or not valid!
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    // error
    if (err) {
      console.log(err);
      return res.status(401).send({ message: 'unauthorized access' })
    }
    // if token is valid then it would be decoded
    console.log('Value in the token: ', decoded);
    req.user = decoded;
    next();
  })
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    // 0. Creating collection in the database -> banner
    const bannerCollection = client.db('roomBooking').collection('banner');

    // 1. Creating collection in the database -> rooms
    const serviceCollection = client.db('roomBooking').collection('rooms');

    // 4. Storing the bookings by users in another collection
    const bookingCollection = client.db('roomBooking').collection('bookings');
    
    // 5. Storing the bookings by users review in another collection
    const reviewCollection = client.db('roomBooking').collection('reviews');

  //   // 1. Getting all the banners data which we manually inserted to our 'roomBooking' database
  //   app.get('/banner', logger, async (req, res) => {
  //     const cursor = bannerCollection.find();
  //     const result = await cursor.toArray();
  //     res.send(result);
  //   })

  //   app.get('/banner/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: new ObjectId(id) };
  //     const result = await bannerCollection.findOne(query);
  //     res.send(result);
  //   })

  //   // Auth Related API
  //   app.post('/jwt', logger, async (req, res) => {
  //     const user = req.body;
  //     console.log('User for token: ', user);
  //     const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // Jwt generating Token
  //     // Setting the Token to LS as cookies
  //     res
  //       .cookie('token', token, {
  //         httpOnly: true,
  //         // secure: false
  //         secure: true,
  //         sameSite: 'none'
  //       })
  //       .send({ success: true });
  //   })

  //   // Auth Related API --> Now we are vanishing the cookie from the console after logout
  //   app.post('/logout', async (req, res) => {
  //     const user = req.body;
  //     console.log('Logging Out: ', user);
  //     res.clearCookie('token', { maxAge: 0 }).send({ success: true });
  //   })

  //   // rooms Related API
  //   // 2. Getting all the rooms data which we manually inserted to our 'carDoctor' database
  //   app.get('/rooms', logger, async (req, res) => {
  //     const cursor = serviceCollection.find();
  //     const result = await cursor.toArray();
  //     res.send(result);
  //   })

  //   // 3. To get specific rooms using particular _id
  //   app.get('/rooms/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: new ObjectId(id) };
  //     const result = await serviceCollection.findOne(query);
  //     res.send(result);
  //   })


  //   // 5. Bookings Operation
  //   app.post('/bookings', async (req, res) => {
  //     const booking = req.body;
  //     console.log(booking);
  //     // Check if a booking with the same email and room_id already exists
  //     const existingBooking = await bookingCollection.findOne({
  //       email: booking.email,
  //       room_id: booking.room_id
  //     });

  //     if (existingBooking) {
  //       // If a booking with the same email and room_id exists, return an error
  //       return res.status(400).json({ error: 'Booking with the same email and room_id already exists.' });
  //     }

  //     const result = await bookingCollection.insertOne(booking);

  //     // Fetch the room with the specified room_id from the booking
  //     const roomToUpdateId = booking.room_id;
  //     const existingRoom = await serviceCollection.findOne({ room_id: roomToUpdateId });

  //     if (existingRoom) {
  //       // If the room exists, convert the available value to a number
  //       const currentAvailable = parseInt(existingRoom.available, 10);

  //       if (!isNaN(currentAvailable)) {
  //         // If the conversion is successful, update the available value by decreasing 1
  //         const updatedAvailable = currentAvailable - 1;

  //         // Perform the update using findOneAndUpdate
  //         const result = await serviceCollection.findOneAndUpdate(
  //           { room_id: roomToUpdateId },
  //           { $set: { available: updatedAvailable.toString() } }, // Convert back to string for update
  //           { returnDocument: 'after' } // Return the updated document
  //         );

  //         if (result.value) {
  //           console.log('Room updated successfully:', result.value);
  //         } else {
  //           console.log('Room not found.');
  //         }
  //       } else {
  //         console.log('Invalid available value (not a number).');
  //       }
  //     } else {
  //       console.log('Room not found.');
  //     }


  //     res.send(result);
  //   });

  //   // 6. Bookings Operation GET
  //   app.get('/bookings', logger, verifyToken, async (req, res) => {
  //     console.log(req.query.email);
  //     console.log('Tok Tok Token', req.cookies.token);
  //     console.log('Token Owner INFO: ', req.user);

  //     // Cheking if you requesting data is under your email or other persons (query) email
  //     // As it is prohibitted to request other persons info
  //     if (req.query.email !== req.user.email) {
  //       return res.status(403).send({ message: 'Forbidden Access' })
  //     }

  //     let query = {};
  //     if (req.query?.email) {
  //       query = { email: req.query.email };
  //     }
  //     const result = await bookingCollection.find(query).toArray();
  //     res.send(result);
  //   });

  //   // 7. Bookings Operation DELETE
  //   app.delete('/bookings/:id', async (req, res) => {
  //     const bookingId = req.params.id;

  //     // Fetch the booking with the specified _id
  //     const bookingToDelete = await bookingCollection.findOne({ _id: new ObjectId(bookingId) });

  //     if (!bookingToDelete) {
  //       // If the booking does not exist, return an error
  //       return res.status(404).json({ error: 'Booking not found.' });
  //     }

  //     // Get today's date in the format YY-MM-DD
  //     const todayDate = moment().format('YYYY-MM-DD');
  //     console.log("Todays Date: ", todayDate);
  //     const startDate = moment(bookingToDelete.checkIn);
  //     const formattedStartDate = startDate.format('YYYY-MM-DD');
  //     console.log("Formatted CheckIn Date: ", formattedStartDate);

  //     const duration = moment.duration(moment(formattedStartDate).diff(moment(todayDate)));
  //     const days = duration.asDays();
  //     console.log("Different Date: ", days);

  //     if (days < 2 || days === 2) {
  //       // If there are less than 2 days until check-in, return an error
  //       return res.status(400).json({ error: 'You must have a minimum of 2 days before check-in to cancel the booking.' });
  //     }

  //     // Get the room_id from the booking to update the corresponding room in serviceCollection
  //     const roomToUpdateId = bookingToDelete.room_id;

  //     // Update the available value in serviceCollection by increasing 1
  //     const existingRoom = await serviceCollection.findOne({ room_id: roomToUpdateId });

  //     if (existingRoom) {
  //       // If the room exists, convert the available value to a number
  //       const currentAvailable = parseInt(existingRoom.available, 10);

  //       if (!isNaN(currentAvailable)) {
  //         // If the conversion is successful, update the available value by increasing 1
  //         const updatedAvailable = currentAvailable + 1;

  //         // Perform the update using findOneAndUpdate
  //         await serviceCollection.findOneAndUpdate(
  //           { room_id: roomToUpdateId },
  //           { $set: { available: updatedAvailable.toString() } }, // Convert back to string for update
  //         );

  //         console.log('Room updated successfully:', roomToUpdateId);
  //       } else {
  //         console.log('Invalid available value (not a number).');
  //       }
  //     } else {
  //       console.log('Room not found.');
  //     }

  //     // Delete the booking after updating the available value
  //     const query = { _id: new ObjectId(bookingId) };
  //     const result = await bookingCollection.deleteOne(query);
  //     res.send(result);
  //   });


  //   // 4. Update Operation 
  //   app.put('/bookings/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const filter = { _id: new ObjectId(id) };
  //     const options = { upsert: true };
  //     const updatedRooomBookings = req.body;
  //     const updatedRoom = {
  //       $set: {
  //         connect_id: updatedRooomBookings.connect_id,
  //         cover_pic: updatedRooomBookings.cover_pic,
  //         title: updatedRooomBookings.title,
  //         email: updatedRooomBookings.email,
  //         room_id: updatedRooomBookings.room_id,
  //         roomPrice: updatedRooomBookings.roomPrice,
  //         checkIn: updatedRooomBookings.checkIn,
  //         checkOut: updatedRooomBookings.checkOut,
  //         days: updatedRooomBookings.days,
  //         totalPrice: updatedRooomBookings.totalPrice
  //       }
  //     }
  //     const result = await bookingCollection.updateOne(filter, updatedRoom, options);
  //     res.send(result)
  //   })

  //   app.post('/review', async (req, res) => {
  //     const uploadReview = req.body;
  //     console.log(uploadReview);

  //     // Check if a review with the same myEmail and roomId already exists
  //     const existingReview = await reviewCollection.findOne({
  //       myEmail: uploadReview.myEmail,
  //       roomId: uploadReview.roomId,
  //     });

  //     if (existingReview) {
  //       // If a review with the same myEmail and roomId exists, return an error
  //       return res.status(400).json({ error: 'A review for this booking already exists.' });
  //     }

  //     const result = await reviewCollection.insertOne(uploadReview);
  //     res.send(result);
  //   })

  //   // 3. Get requested object from DB and then use Loader in the client side 
  //   app.get('/review/:title', async (req, res) => {
  //     const title = req.params.title;
  //     const query = { title: title };
  //     const result = await reviewCollection.find(query).toArray();
  //     console.log(result);
  //     res.send(result);
  // })  

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// =======================================================================================

app.get('/', (req, res) => {
  res.send('Room booking is running');
})

app.listen(port, () => {
  console.log(`Room booking server is running on port: ${port}`);
})