const fs = require("fs");
const express = require("express")
const app = express();
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

const dataTempDonatur = () => {
  let dataTemp = fs.readFileSync("./dataTemp/dataTempFile.json", "utf-8")
  dataTemp = JSON.parse(dataTemp)
  return dataTemp
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

// HOME ROUTE
app.get("/", (req, res) => {
  dataTemp = dataTempDonatur()
  if(!dataTemp.length == 0){
    fs.writeFileSync("./dataTemp/dataTempFile.json", "[]", "utf-8")
  }
  res.render("index", {
    layout: "layouts/main-layout",
  })
})

// FORMULIR DONASI ROUTE
app.get("/formulir-userId", (req, res) => {
  dataTemp = dataTempDonatur()
  res.render("formulir-userId", {
    layout: "layouts/main-layout",
    data: dataTemp
  })
})

app.post("/formulir-userId", 
[
  check("email", "Email yang anda masukan salah").isEmail(),
  check("phone", "Nomor yang anda masukan salah").isMobilePhone("id-ID"),
], (req, res) => {
  const result = validationResult(req)
  if(!result.isEmpty()) {
    res.render("formulir-userId", {
      layout: "layouts/main-layout",
      errors: result.array(),
      data: dataTemp
    })
  }else{
    let userId = fs.readFileSync("./dataTemp/dataTempFile.json", "utf-8");
    userId = JSON.parse(userId);
    if (userId.length == 0) {
      userId.push(req.body);
      const dataTemp = JSON.stringify(userId);
      fs.writeFileSync("./dataTemp/dataTempFile.json", dataTemp, "utf-8");
    }
    res.redirect("/formulir-pickup");
  }
})

app.get("/formulir-pickup", (req, res) => {
  res.render("formulir-pickup", {
    layout: "layouts/main-layout"
  })
})

app.post("/formulir-pickup", (req, res, next) => {
  let result
  if(!req.file) {
    result = new Error("Ekstensi file hanya PNG, JPG, dan JPEG")
    res.render("formulir-pickup", {
      layout: "layouts/main-layout",
      errors: result.message
    })
  }else{
    let userId = fs.readFileSync("./dataTemp/dataTempFile.json", "utf-8");
    userId = JSON.parse(userId);
    let dataTemp = userId[0];
    dataTemp.stuffType = req.body.stuffType,
    dataTemp.conditionType = req.body.conditionType,
    dataTemp.description = req.body.description;
    dataTemp.date = req.body.date;
    dataTemp.time = req.body.time;
    dataTemp.image = '.\\data\\uploads\\' + req.file.filename;
    Donatur.insertMany(dataTemp)
    fs.writeFileSync("./dataTemp/dataTempFile.json", "[]", "utf-8")
    res.redirect("/");
  }
})

// REGISTER, LOGIN DAN LOGOUT ROUTE
app.get("/register", (req, res) => {
  res.render("register", {
    layout: "layouts/main-layout",
  })
})

app.post("/register", [
  check("email", "Format email yang anda masukan salah").isEmail({
    require_tld: true,
    domain_specific_validation: true,
  })
], (req, res) => {
  console.log(req.body)
  const result = validationResult(req)
  if(!result.isEmpty){
    res.render("register", {
      layout: "layouts/main-layout",
      errors: result.array()
    })
  }else{
    if(req.body.password == req.body.passwordConfirm) {
      const newAccount = {
      email: req.body.email,
      password: req.body.password,
      username: req.body.username
    }
      Account.insertMany(newAccount)
      res.redirect("/")
    }else{
      res.redirect("/register");
    }
  }
})

app.post("/login", async (req, res) => {
  const account = await Account.findOne({email: req.body.email})
  console.log(account)
  let result
  if(!account){
    result = new Error("Akun ga ada")
    res.render("login", {
      layout: "layouts/main-layout",
      errors: result.message
    })
  }else{
    if(account.password == req.body.password) {
      req.session.login = true
      req.session.user = account
      req.session.save()
      res.render("account", {
        layout: "layouts/main-layout",
        data: req.session.user
      })
    }else{
      result = new Error("Password salah")
      res.render("login", {
        layout: "layouts/main-layout",
        errors: result.message
      })
    }
  }
})

app.get("/logout", (req, res) => {
  req.session.destroy()
  res.redirect("/")
})

// BLOG ROUTE
app.get("/blog", async (req, res) => {
  const blogs = await Article.find()
  res.render("blog", {
    layout: "layouts/main-layout",
    blogs
  })
})

app.get("/article/:blogId", async (req, res) =>{
  const article = await Article.findOne({_id: req.params.blogId})
  res.render('article', {
    layout: "layouts/main-layout",
    article
  })
})

app.get("/write", (req, res) => {
  res.render("write-article", {
    layout: "layouts/main-layout"
  })
})

app.post("/write", (req, res) => {
  // let result
  // if(!req.file) {
  //   result = new Error("Esktensi file hanya PNG, JPG dan JPEG")
  //   res.render("write-article", {
  //     layout: "layouts/main-layout",
  //     errors: result.message
  //   })
  // }else{
  //   const newArticle = {
  //     author: req.session.user._id,
  //     image: '.\\data\\uploads\\' + req.file.filename,
  //     article: req.body.article,
  //     title: req.body.title
  //   }
  // }
  console.log(req.body)
  res.redirect("/")
})

// ACCOUNT ROUTE
app.get("/account", (req, res) => {
  if(req.session.login){
    res.render("account", {
      layout: "layouts/main-layout",
      data: req.session.user
    })
  }else{ 
    res.render("login", {
      layout: "layouts/main-layout"
    })
  }
})

module.exports = app;