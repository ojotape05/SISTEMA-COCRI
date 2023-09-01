const express = require('express');
const router = express.Router();

bens = {
    "tipos":{
        "60": "Apartamento",
        "61": "Casa",
        "62": "Terreno",
        "64": "Empresarial"
    }
}

router.get("/", function (req, res) {
    res.json(bens)
})

module.exports = router