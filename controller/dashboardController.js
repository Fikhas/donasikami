const asyncHandler = require("express-async-handler")

const {Account, Donatur, Article, Message} = require("../model/modelsdb")

exports.dashboard = asyncHandler(async (req, res) => {
    const accounts = await Account.find()
    res.render("dashboard-accounts", {
        title: "ACCOUNTS",
        layout: "layouts/dashboard-layout",
        accounts
    })
})

exports.account_dashboard = asyncHandler(async (req, res) => {
    // const accounts = await Account.find()
    const accounts = await Account.find()
    .skip(1)
    .limit(2)
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

exports.message_dashboard = asyncHandler(async (req, res) => {
    const messages = await Message.find()
    res.render("dashboard-messages", {
        layout: "layouts/dashboard-layout",
        title: "MESSAGES",
        messages
    })
})

exports.show_article = asyncHandler(async (req, res) => {
    const article = await Article.findOne({_id: req.body._id})
    res.render("detail-article", {
        layout: "layouts/dashboard-layout",
        title: "DETAIL BLOG",
        article
    })
})

exports.show_message = asyncHandler(async (req, res) => {
    const message = await Message.findOne({_id: req.body._id})
    res.render("message-detail", {
        layout: "layouts/dashboard-layout",
        title: "DETAIL MESSAGE",
        message
    })
})

exports.delete_article = asyncHandler(async (req, res) => {
    await Article.deleteOne({_id: req.body._id})
    res.redirect("/catalog/blog-dashboard")
})

exports.show_account = asyncHandler(async (req, res) => {
    const data = await Account.findOne({_id: req.body._id})
    res.render("account-detail", {
        layout: "layouts/dashboard-layout",
        title: "DETAIL ACCOUNT",
        data
    })
})

exports.show_donate = asyncHandler(async (req, res) => {
    const data = await Donatur.findOne({_id: req.body._id})
    res.render("donate-detail", {
        layout: "layouts/dashboard-layout",
        title: "DETAIL DONASI",
        data
    })
})