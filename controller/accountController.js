const asyncHandler = require("express-async-handler")

const {Article} = require("../model/modelsdb")

exports.account = asyncHandler(async (req, res) => {
  // if(req.session.login){
  const blogs = await Article.find({author: "649bdee7bfc3e1a8e0eb7de3"})
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
  // }else{
  //   res.render("login", {
  //     layout: "layouts/main-layout",
  //   })
  // }
})