const asyncHandler = require("express-async-handler")
const {body, check, validationResult} = require("express-validator");

const {Account, Article} = require("../model/modelsdb")

exports.register = (req, res) => {
    res.render("register", {
    layout: "layouts/main-layout",
  })
}

exports.register_post = [
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
}

exports.login_post = asyncHandler(async (req, res) => {
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
        const blogs = await Article.find({author: req.session.user._id})
        let myBlogs = []
        blogs.forEach(blog => {
            blog.shortArticle = blog.article.slice(3, blog.article.length - 4)
            myBlogs.push(blog)
        })
        res.render("account", {
            layout: "layouts/main-layout",
            data: req.session.user,
            myBlogs
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

exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}