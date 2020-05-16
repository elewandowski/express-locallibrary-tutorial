const express = require("express")
const router = express.Router()

router.get("/", function (req, res) {
    res.send('Wiki home page')
})

router.get("/about", (req, res) => {
    res.send('Wiki about page')
})


module.exports = router