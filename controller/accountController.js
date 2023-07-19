const asyncHandler = require("express-async-handler")

const {Article} = require("../model/modelsdb")

exports.account = asyncHandler(async (req, res) => {
  if(req.session.login){
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
    res.render("login", {
      layout: "layouts/main-layout",
    })
  }
})

exports.edit_article = asyncHandler(async (req, res) => {
    const blog = await Article.findOne({_id: req.params.blogId})
    res.render("update-article", {
        layout: "layouts/main-layout",
        blog
    })
})

exports.update_article_put = asyncHandler(async (req, res) => {
    await Article.updateOne({_id: req.body._id}, {
        $set: {
        title: req.body.title,
        image: '\\data\\uploads\\' + req.file.filename,
        article: req.body.article
        }
    })
    res.redirect("/catalog/blog")
})

exports.delete_article = asyncHandler(async (req, res) => {
    await Article.deleteOne({_id: req.params.blogId})
    res.redirect("/catalog/account")
})