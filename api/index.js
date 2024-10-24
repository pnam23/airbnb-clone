const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imgDownload = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Place = require('./models/Place');


require('dotenv').config();
const app = express();


const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'eyJhbGci'

mongoose.connect(process.env.MONGO_URL);

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(__dirname + '/uploads'));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
  }));



app.get('/test', (req, res) => {
    res.json('test ok');
});

app.post('/register', async (req,res) => {
    
    const {name,email,password} = req.body;
  
    try {
      const userDoc = await User.create({
        name,
        email,
        password:bcrypt.hashSync(password, bcryptSalt),
      });
      res.json(userDoc);
    } catch (e) {
      res.status(422).json(e);
    }
  
  });

app.post('/login', async (req,res) => {
    const {email,password} = req.body;
    const userDoc = await User.findOne({email});
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign({
          email:userDoc.email,
          id:userDoc._id
        }, jwtSecret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json(userDoc);
        });
      } else {
        res.status(422).json('pass not ok');
      }
    } else {
      res.json('not found');
    }
  });

app.get('/profile', (req,res) => {
    const {token} = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name,email,_id} = await User.findById(userData.id);
        res.json({name,email,_id});
      });
    } else {
      res.json(null);
    }
});

app.post('/logout', (req,res) => {
    res.cookie('token', '').json(true);
  });


app.post('/upload-by-link', async (req, res) => {
    const { link } = req.body;
    if (!link.startsWith('http://') && !link.startsWith('https://')) {
        return res.status(400).json({ error: 'Invalid URL. Only http and https are supported.' });
    }
    const newName = 'pic' + Date.now() + '.jpg';
    try {
        await imgDownload.image({
            url: link,
            dest: __dirname + '/uploads/' + newName,
        });
        res.json(newName);
    } catch (err) {
        res.status(500).json({ error: 'Image download failed' });
    }
});

const photosMiddleware = multer({dest:'uploads/'});
app.post('/upload', photosMiddleware.array('photos', 100) ,(req, res) => {
    const uploadFiles = [];
    
    req.files.forEach((file) => {
        const { path: tempPath, originalname } = file; 
        const ext = path.extname(originalname);  
        const newPath = tempPath + ext;
        try {
            fs.renameSync(tempPath, newPath);
            const fileName = path.basename(newPath);  
            uploadFiles.push(fileName);
        } catch (err) {
            console.error('Error renaming file:', err);
            return res.status(500).json({ error: 'File renaming failed' });
        }
    });
    res.json(uploadFiles);
});

app.post('/places', async (req, res) => {
  const {token} = req.cookies;
  const {
    title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner:userData.id,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(placeDoc);
  });
});


app.get('/places', (req, res) => {
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json(await Place.find({owner:id}))
  });
})

app.get('/places/:id', async (req, res) => {
  const {id} = req.params;
  res.json(await Place.findById(id));
});

app.put('/places', async (req, res) => {
  const {token} = req.cookies;
  const {
    id, title, address, addedPhotos, description,
    perks, extraInfo, checkIn, checkOut, maxGuests
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if(userData.id === placeDoc.owner.toString()){
      placeDoc.set({
        title, address, photos:addedPhotos, description,
        perks, extraInfo, checkIn, checkOut, maxGuests
      })
      await placeDoc.save();
      res.json(placeDoc);
    }
  });
});

app.listen(4000);