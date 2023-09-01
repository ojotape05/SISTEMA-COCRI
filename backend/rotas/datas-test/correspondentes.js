const express = require('express');
const router = express.Router();

correspondentes = {
  "correspondentes": [
      {
          "CID": 1000,
          "RazaoSocial": "CORRESPONDENTE 1 LTDA",
          "NomeFantasia": "CORRESP 1",
          "CNPJ": "93.996.500/0001-14"
      },
      {
          "CID": 1001,
          "RazaoSocial": "CORRESPONDENTE 2 LTDA",
          "NomeFantasia": "CORRESP 2",
          "CNPJ": "22.222.222/0002-22"
      }
  ]
}

router.get("/", function (req, res) {
    res.json(correspondentes)
})

module.exports = router