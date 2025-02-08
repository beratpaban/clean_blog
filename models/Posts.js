const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostScheme = new Schema({
  title: String,
  detail: String,
  image: String,
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

const Posts = mongoose.model('post', PostScheme);
module.exports = Posts;
