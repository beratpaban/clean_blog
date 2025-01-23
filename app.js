const express = require('express');
const mongoose = require('mongoose');

const Posts = require('./models/Posts');

const app = express();

//connect db
mongoose.connect('mongodb://localhost/cleanblog-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set('view engine', 'ejs');
const port = 3000;

//middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req, res) => {
  const posts = await Posts.find({});
  res.render('index', {
    posts,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/posty', async (req, res) => {
  await Posts.create(req.body);
  res.redirect('/');
});

app.listen(port, (req, res) => {
  console.log(`Sunucu ${port} portunda başlatıldı.`);
});
