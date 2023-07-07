const fs = require("fs")
const {body, check, validationResult} = require("express-validator");

const asyncHandler = require("express-async-handler")

const {Donatur} = require("../model/modelsdb")

const dataTempDonatur = () => {
    let dataTemp = fs.readFileSync("./dataTemp/dataTempFile.json", "utf-8")
    dataTemp = JSON.parse(dataTemp)
    return dataTemp
}

exports.form_userid = (req, res) => {
    dataTemp = dataTempDonatur()
    res.render("formulir-userId", {
        layout: "layouts/main-layout",
        data: dataTemp
    })
}

exports.form_userId_post = [
    check("email", "Email yang anda masukan salah").isEmail(),
    check("phone", "Nomor yang anda masukan salah").isMobilePhone("id-ID"),
    (req, res) => {
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
            res.redirect("/catalog/formulir-pickup");
        }
    }
]

exports.form_pickup = (req, res) => {
    res.render("formulir-pickup", {
        layout: "layouts/main-layout"
    })
}

exports.form_pickup_post = (req, res) => {
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
        dataTemp.image = '\\data\\uploads\\' + req.file.filename;
        Donatur.insertMany(dataTemp)
        fs.writeFileSync("./dataTemp/dataTempFile.json", "[]", "utf-8")
        res.redirect("/catalog/thanks");
    }
}

exports.thanks = (req, res) => {
    res.render("thanks", {
        layout: "layouts/main-layout"
    })
}