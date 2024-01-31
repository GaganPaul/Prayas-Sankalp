const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/Prayass-SankalpDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for the seller data
const sellerSchema = new mongoose.Schema({
    name: String,
    phoneNo: Number,
    location: String,
    category: String,
    title: String,
    price: Number,
    description: String,
    quantity: Number,
    netWeight: String,
    foodImage: String
});

// Create a model based on the schema
const Seller = mongoose.model('Seller', sellerSchema);

// Middleware to parse JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/SellerForm.html');
});

// Handle form submission
app.post('/submitSellerForm', (req, res) => {
    const sellerData = req.body;

    // Create a new seller instance
    const newSeller = new Seller(sellerData);

    // Save the seller data to the database
    newSeller.save()
        .then(() => {
            console.log('Seller data saved to the database');
            res.status(200).send('Seller data saved successfully');
        })
        .catch((error) => {
            console.error('Error saving seller data:', error);
            res.status(500).send('Internal Server Error');
        });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

