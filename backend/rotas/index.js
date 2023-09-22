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

    const homeJSON = require("./datas-test/home")
    app.use('/homeJSON',homeJSON)
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

// Rotas de post
function post_infos(app){
    const aberturaPost = require("./post/abertura")
    app.use('/abertura-post', aberturaPost)

    const triagemPost = require("./post/triagem")
    app.use('/triagem-post', triagemPost)
}

module.exports = {get_json,get_pages,post_infos}