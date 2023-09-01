const express = require('express');
const router = express.Router();

router.get("/", function (req, res){
    res.status(200).render("abertura")
})

router.post("/send-abertura", function (req,res) {
    data = req.body
    console.log(data)
})

module.exports = router