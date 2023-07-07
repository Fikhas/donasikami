const asyncHandler = require("express-async-handler")

const {Article} = require("../model/modelsdb")

exports.blog = asyncHandler(async (req, res) => {
    const blogs = await Article.find()
    let newBlogs = []
    blogs.forEach(blog => {
        blog.shortArticle = blog.article.slice(3, blog.article.length - 4)
        newBlogs.push(blog)
    })
    res.render("blog", {
        layout: "layouts/main-layout",
        newBlogs
    })
})

exports.show_article = asyncHandler(async (req, res) => {
    const article = await Article.findOne({_id: req.params.blogId})
    res.render('article', {
        layout: "layouts/main-layout",
        article
    })
})

exports.write_article = (req, res) => {
    res.render("write-article", {
        layout: "layouts/main-layout"
    })
}

exports.write_article_post = (req, res) => {
    let result
    if(!req.file) {
        result = new Error("Esktensi file hanya PNG, JPG dan JPEG")
        res.render("write-article", {
            layout: "layouts/main-layout",
            errors: result.message
        })
    }else{
        const newArticle = {
            author: "649fa79a9db12c37d0b45e3e",
            image: '\\data\\uploads\\' + req.file.filename,
            article: req.body.article,
            title: req.body.title
        }
        Article.insertMany(newArticle)
        res.redirect("/catalog/account")
    }
}