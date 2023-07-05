const fs = require("fs")

const asyncHandler = require("express-async-handler")

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