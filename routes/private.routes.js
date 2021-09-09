const express = require('express');
const router = express.Router();

function isLoggedIn(req, res, next) {
    if (req.session.currentUser) next() // next invocation tells Express that the middleware has done all it work
    else res.redirect("/auth/login")
}

router.get("/profile", isLoggedIn, (req, res) => {
    if (req.session.currentUser) res.render("user-profile", { user: req.session.currentUser })
    else res.redirect("/private")
})

router.get("/", isLoggedIn, (req, res) => {
    res.render("private")
})

// function isAdmin(req, res, next) {

//     if (req.session.currentUser)) // Any criteria to determin role is as good as any
//     {
//         req.session.currentUser.isAdmin = true;
//         req.session.currentUser.isInternal = true;
//     } else if (req.session.currentUser) {
//         req.session.currentUser.isAdmin = false;
//         req.session.currentUser.isInternal = false;
//     } else {
//         res.redirect("/auth/login")
//     }

//     next() // next invocation tells Express that the middleware has done all it work
// }



module.exports = router;
