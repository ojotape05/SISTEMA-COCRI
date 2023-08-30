// Importa o Express
const express = require('express');

// Inicia o Router do Express
const router = express.Router();

router.get("/", function (req, res) {
    res.status(200).render("index")
})

router.get("/abertura", function (req, res) {
    res.status(200).render("abertura")
})

router.post("/send-abertura", function (req,res) {
    data = req.body
    console.log(data)
})

router.get("/avaliacao", function (req, res) {
    res.status(200).render("avaliacao")
})

router.get("/triagem", function (req, res) {
    res.status(200).render("triagem")
})

module.exports = router;