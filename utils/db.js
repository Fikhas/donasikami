const mongoose = require('mongoose');

const localDB = "mongodb://127.0.0.1:27017/donasiKami"
const dev_db_url =
  "mongodb+srv://fikrihasan_30:ZOrcfbvr9ogYFBSJ@cluster0.zr5xf.mongodb.net/donasiKami?retryWrites=true&w=majority";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {});
// Set up mongoose connection