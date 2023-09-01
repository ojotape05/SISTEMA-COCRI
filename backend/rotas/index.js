// Rotas de JSON
function get_json(app){
    const agenciasJSON = require("./datas/agencias")
    app.use('/agencias', agenciasJSON)

    const avaliadorasJSON = require("./datas/avaliadoras")
    app.use('/avaliadoras', avaliadorasJSON)

    const bensJSON = require("./datas/bens")
    app.use('/bens', bensJSON)

    const correspondentesJSON = require("./datas/correspondentes")
    app.use('/correspondentes', correspondentesJSON)
}

// Rotas de página
function get_pages(app){
    const homeRouter = require("./pages/home")
    app.use('/', homeRouter)

    const aberturaRouter = require("./pages/abertura")
    app.use('/abertura', aberturaRouter)

    const avaliacaoRouter = require("./pages/avaliacao")
    app.use('/avaliacao', avaliacaoRouter)

    const triagemRouter = require("./pages/triagem")
    app.use('/triagem', triagemRouter)
}

module.exports = {get_json,get_pages}