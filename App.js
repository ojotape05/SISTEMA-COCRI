require("dotenv").config();
const express = require("express");
const app = express();

//configurando express
const config = require("./backend/app-config")
config.write(app)

//rotas
const rotas = require("./backend/rotas/index")
rotas.get_json(app)
rotas.get_pages(app)
rotas.post_infos(app)

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na http://localhost:${process.env.PORT}`);
})