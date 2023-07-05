const fs = require("fs");
const express = require("express")
const app = express();
const router = express.Router()
const expressLayouts = require("express-ejs-layouts");
var livereload = require("livereload");
var connectLiveReload = require("connect-livereload");
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const multer = require("multer");
const {body, check, validationResult} = require("express-validator");
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
// const RateLimit = require("express-rate-limit");

// const limiter = RateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 20,
// });

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const catalogRouter = require("./routes/catalog")

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("localhost:3000");
  }, 100);
});

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

require("./utils/db")
const {Donatur, Account, Article} = require("./model/modelsdb")

// app.use(compression());
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
//     },
//   })
// );
// app.use(limiter);

// const tes = Account.findOne({email: "fikrihasan309@gmail.com"}).then(
//   akun => {
//     const article1 = {
//       author: akun._id,
//       image: "/assets/images/plumpang.png",
//       article: "lorem",
//       title: "lorem"
//     }
//     Article.insertMany(article1).then(() => console.log("oke"))
//   }
// )

// const article1 = Article.findOne({_id: '649a9b7e73aa63c171219702'}).then((artikel) => {
//   Account.findOne({_id: artikel.author}).then(author => console.log(author)).catch(e => console.log(e))
// })

// MIDDLEWARE
app.use(methodOverride('_method'));
app.set("view engine", "ejs")
app.use(expressLayouts)
app.use(express.static("public"))
app.use("/froalacss", express.static(__dirname + "/node_modules/froala-editor/css/froala_editor.pkgd.min.css"))
app.use("/froalajs", express.static(__dirname + "/node_modules/froala-editor/js/froala_editor.pkgd.min.js"))
app.use(connectLiveReload())
app.use(multer({storage: storage, fileFilter: fileFilter}).single("image"))
app.use(bodyParser.urlencoded({extended: false}))
app.use(session({
  secret: "secret",
  saveUninitialized: true,
  resave: true
}))
app.use("/", indexRouter)
app.use("/users", usersRouter)
app.use("/catalog", catalogRouter)

module.exports = app;