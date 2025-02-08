const Posts = require('../models/Posts');
const fs = require('fs');

exports.getAllPosts = async (req, res) => {
  const page = req.query.page || 1;
  const postsPerPage = 5;
  const totalPosts = await Posts.find().countDocuments();
  const posts = await Posts.find({})
    .sort('-dateCreated')
    .skip((page - 1) * postsPerPage)
    .limit(postsPerPage);
  res.render('index', {
    posts: posts,
    current: page,
    pages: Math.ceil(totalPosts / postsPerPage),
  });
};

exports.getPost = async (req, res) => {
  const posts = await Posts.findById(req.params.id);
  res.render('posts', {
    posts,
  });
};

exports.createPost = async (req, res) => {
  const uploadDir = 'public/uploads';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadedPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  uploadedImage.mv(uploadedPath, async () => {
    await Posts.create({
      ...req.body,
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePost = async (req, res) => {
  const post = await Posts.findOne({ _id: req.params.id });
  post.title = req.body.title;
  post.detail = req.body.detail;
  post.save();

  res.redirect(`/posts/${req.params.id}`);
};

exports.deletePost = async (req, res) => {
  const post = await Posts.findOne({ _id: req.params.id });
  let deletedPost = __dirname + '/../public/' + post.image;
  fs.unlinkSync(deletedPost);
  await Posts.findByIdAndDelete(req.params.id);
  res.redirect('/');
};
