const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.get("/", function (req, res) {
    new Promise( (resolve,reject) => {
        db.selectHome()
        .then( resp =>{
            resolve(res.json({message: "OK",processos: resp}))
        })
        .catch( err => {
            reject(res.json({message: "FAIL",error: err}))
        })
    })
})

module.exports = router

