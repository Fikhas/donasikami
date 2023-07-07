const express = require("express");
const router = express.Router();
const app = express()

const home_controller = require("../controller/homeController");
const form_controller = require("../controller/formController")
const rll_controller = require("../controller/rllController")
const account_controller = require("../controller/accountController")
const blog_controller = require("../controller/blogController")
const dashboard_controller = require("../controller/dashboardController")

// HOME ROUTE
router.get("/", home_controller.index_home)

// FORMULIR ROUTE
router.get("/formulir-userId", form_controller.form_userid)

router.post("/formulir-userId", form_controller.form_userId_post)

router.get("/formulir-pickup", form_controller.form_pickup)

router.post("/formulir-pickup", form_controller.form_pickup_post)

router.get("/thanks", form_controller.thanks)

// RLL ROUTE
router.get("/register", rll_controller.register)

router.post("/register", rll_controller.register_post)

router.post("/login", rll_controller.login_post)

router.get("/logout", rll_controller.logout)

// BLOG ROUTE
router.get("/blog", blog_controller.blog)

router.get("/article/:blogId", blog_controller.show_article)

router.get("/write", blog_controller.write_article)

router.post("/write", blog_controller.write_article_post)

// ACCOUNT ROUTE
router.get("/account", account_controller.account)

// DASHBOARD ROUTE
router.get("/dashboard", dashboard_controller.dashboard)

router.get("/account-dashboard", dashboard_controller.account_dashboard)

router.get("/blog-dashboard", dashboard_controller.blog_dashboard)

router.get("/donate-dashboard", dashboard_controller.donate_dashboard)

router.post("/update-article", dashboard_controller.update_article_post)

// router.put("/update-article", dashboard_controller.update_article_put)

// router.delete("/delete-article", dashboard_controller.delete_article)

module.exports = router;