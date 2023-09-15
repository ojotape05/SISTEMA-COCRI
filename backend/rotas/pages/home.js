const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.get("/", async function (req, res) {
    const response = await db.processosDetails()
    console.log("homeResponse:",response)
    res.status(200).render("home",{processos:response})
    
})

module.exports = router