const asyncHandler = require("express-async-handler")

const {Account, Donatur, Article} = require("../model/modelsdb")

exports.dashboard = asyncHandler(async (req, res) => {
    const accounts = await Account.find()
    res.render("dashboard-accounts", {
        title: "ACCOUNTS",
        layout: "layouts/dashboard-layout",
        accounts
    })
})

exports.account_dashboard = asyncHandler(async (req, res) => {
    const accounts = await Account.find()
    res.render("dashboard-accounts", {
        layout: "layouts/dashboard-layout",
        title: "ACCOUNTS",
        accounts
    })
})

exports.blog_dashboard = asyncHandler(async (req, res) => {
    const blogs = await Article.find()
    res.render("dashboard-blogs", {
        layout: "layouts/dashboard-layout",
        title: "BLOGS",
        blogs
    })
})

exports.donate_dashboard = asyncHandler(async (req, res) => {
    const donates = await Donatur.find()
    res.render("dashboard-donates", {
        layout: "layouts/dashboard-layout",
        title: "DONATES",
        donates
    })
})

exports.update_article_post = asyncHandler(async (req, res) => {
    const blog = await Article.findOne({_id: req.body._id})
    console.log(blog)
    res.render("update-article", {
        layout: "layouts/dashboard-layout",
        title: "EDIT BLOG",
        blog
    })
})

exports.update_article_put = asyncHandler(async (req, res) => {
    await Article.updateOne({_id: req.body._id}, {
        $set: {
        title: req.body.title,
        article: req.body.article
        }
    })
    res.redirect("/dashboard")
})

exports.delete_article = asyncHandler(async (req, res) => {
    await Article.deleteOne({_id: req.body._id})
    res.redirect("/blog-dashboard")
})