require("dotenv").config();
const express = require("express");
const app = express();

//configurando express
const config = require("./backend/app-config")
config.write(app)

//rotas
const router = require("./backend/rotas")
app.use(router)

//iniciando database
require("./backend/database/index")

app.listen(process.env.PORT, () => {
    console.log(`Servidor rodando na http://localhost:${process.env.PORT}`);
})