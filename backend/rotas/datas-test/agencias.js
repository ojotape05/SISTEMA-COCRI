const express = require('express');
const router = express.Router();

agencias = {
    "agencias": [
      {
        "nome_agencia": "AGENCIA 1",
        "cid": 1,
        "nome_superintendencia": "EXEMP"
      },
      {
        "nome_agencia": "AGENCIA 2",
        "cid": 2,
        "nome_superintendencia": "EXEMP"
      }
    ]
}  

router.get("/", function (req, res) {
    res.json(agencias)
})

module.exports = router