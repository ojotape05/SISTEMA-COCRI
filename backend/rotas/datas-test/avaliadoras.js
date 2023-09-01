const express = require('express');
const router = express.Router();

avaliadoras = {
    "avaliadoras": [
        {
            "CNPJ": "01.234.567/0001-89",
            "EMPRESA": "EMPRESA 1"
        },
        {
            "CNPJ": "89.567.234/0001-01",
            "EMPRESA": "EMPRESA 2"
        }
    ]
}

router.get("/", function (req, res) {
    res.json(avaliadoras)
})

module.exports = router