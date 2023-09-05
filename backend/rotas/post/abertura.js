const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.post("/", function (req,res) {
    data = req.body
    console.log(data)
    response = db.insertAbertura(data)
    res.send(response)
})

module.exports = router