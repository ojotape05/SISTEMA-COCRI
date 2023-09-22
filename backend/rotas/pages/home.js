const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.get("/", async function (req, res) {
    db.processosDetails()
    .then( response => {
        console.log({sucess: true,processo: response})
        res.status(200).render("home",{sucess: true,processo: response})
    })
    .catch( err => {
        console.log({sucess: false,processo: err})
        res.status(400).render("home",{sucess: false,error: err})
    })
    
})

module.exports = router