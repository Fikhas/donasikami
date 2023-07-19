const fs = require("fs")

const asyncHandler = require("express-async-handler")

const {Message} = require("../model/modelsdb")

const dataTempDonatur = () => {
  let dataTemp = fs.readFileSync("./dataTemp/dataTempFile.json", "utf-8")
  dataTemp = JSON.parse(dataTemp)
  return dataTemp
}

exports.index_home = (req, res) => {
    dataTemp = dataTempDonatur()
    if(!dataTemp.length == 0){
        fs.writeFileSync("./dataTemp/dataTempFile.json", "[]", "utf-8")
    }
    res.render("index", {
    layout: "layouts/main-layout",
  })
}

exports.send_message = asyncHandler(async (req, res) => {
  const newMessage = {
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message
  }
  await Message.insertMany(newMessage)
  res.redirect("/")
})