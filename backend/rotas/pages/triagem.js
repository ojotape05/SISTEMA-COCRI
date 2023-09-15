const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.get("/", async function (req, res) {
    // Puxando id_processo do URL
    const id_processo = req.query.id_processo
    
    db.processosDetails(id_processo)
    .then( response => {
        console.log({sucess: true,processo: response})
        res.status(200).render("triagem",{sucess: true,processo: response})
    })
    .catch( err => {
        console.log({sucess: false,processo: err})
        res.status(400).render("triagem",{sucess: false,error: err})
    })
})

module.exports = router