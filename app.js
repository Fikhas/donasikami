const fs = require("fs");
const express = require("express")
const app = express();
const expressLayouts = require("express-ejs-layouts");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const bodyParser = require("body-parser")
const methodOverride = require('method-override');
const multer = require("multer");
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const logger = require("morgan")
const cookieParser = require("cookie-parser");
// const RateLimit = require("express-rate-limit");

// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const catalogRouter = require("./routes/catalog")

// const liveReloadServer = livereload.createServer();
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("localhost:3000");
//   }, 100);
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/data/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    },

})

const fileFilter = (req, file, cb) => {
  if(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true)
    } else {
      cb(null, false)
    }
}

if(!fs.existsSync("./dataTemp")) {
  fs.mkdirSync("./dataTemp")
}

if(!fs.existsSync("./dataTemp/dataTempFile.json")){
  fs.writeFileSync("./dataTemp/dataTempFile.json", "[]", "utf-8")
}

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const dev_db_url =
  "mongodb+srv://fikrihasan_30:ZOrcfbvr9ogYFBSJ@cluster0.zr5xf.mongodb.net/donasiKami";
const mongoDB = process.env.MONGODB_URI || dev_db_url;
const localDB = "mongodb://127.0.0.1:27017/donasiKami"

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// app.use(compression());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
//     },
//   })
// );
// app.use(limiter);

// MIDDLEWARE
// app.use(methodOverride('_method'));
app.set("view engine", "ejs")
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts)
app.use(express.static("public"))
app.use("/froalacss", express.static(__dirname + "/node_modules/froala-editor/css/froala_editor.pkgd.min.css"))
app.use("/froalajs", express.static(__dirname + "/node_modules/froala-editor/js/froala_editor.pkgd.min.js"))
// app.use(connectLiveReload())
app.use(multer({storage: storage, fileFilter: fileFilter}).single("image"))
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))
app.use(cookieParser());
app.use(logger("dev"));
app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/catalog", catalogRouter)

module.exports = app;