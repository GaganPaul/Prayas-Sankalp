const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Multer configuration for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Specify the directory to store uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'SellerForm.html'));
});

const mongoURI = 'mongodb://localhost:27017';
const client = new MongoClient(mongoURI);

client.connect()
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const database = client.db('Prayass-SankalpDB');
const foodCollection = database.collection('sellers');
const refurbishedCollection = database.collection('refurbishedproducts');

app.post('/submitSellerForm/sellers', upload.single('foodImage'), (req, res) => {
    const formData = req.body;
    formData.foodImage = req.file.filename; // Add the filename to formData

    foodCollection.insertOne(formData)
        .then(result => {
            console.log('Data inserted into food collection:', result);
            res.send('Form submitted successfully');
        })
        .catch(err => {
            console.error('Error inserting data into food collection:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/submitSellerForm/refurbishedproducts', upload.single('productImage'), (req, res) => {
    const formData = req.body;
    formData.productImage = req.file.filename; // Add the filename to formData

    refurbishedCollection.insertOne(formData)
        .then(result => {
            console.log('Data inserted into refurbished collection:', result);
            res.send('Form submitted successfully');
        })
        .catch(err => {
            console.error('Error inserting data into refurbished collection:', err);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
