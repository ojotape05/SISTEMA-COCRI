const express = require("express");
const Handlebars = require("express-handlebars")
const path = require("path");

function write(app){
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }))
    app.use(express.static(path.join('./frontend')))

    app.engine('handlebars', Handlebars({
    extname: '.handlebars',
    helpers: "../helpers/hps.js"}))

    app.set('view engine', 'handlebars');
    app.set("views", "./frontend/views");

    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
}

module.exports = {write}