const express = require('express');
const router = express.Router();
const db = require("../../database/db")

router.post("/", function (req,res) {
    const data = req.body; console.log(data)
    db.triagem(data)
    .then( resp =>{ 

        res.status(200).json({sucess:true,message: resp})
    })
    .catch( e => {
        console.log(e)
        res.status(500).json({sucess:false,message: "Erro, tente novamente"})
    })
})

module.exports = router