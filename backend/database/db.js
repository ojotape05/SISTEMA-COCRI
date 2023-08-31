require("dotenv").config();

async function connect() {
    if (global.connection)
        return global.connection.connect();
    else{
        const { Pool } = require('pg');
        const pool = new Pool({
            connectionString: process.env.CONNECTION_STRING
        });

        //apenas testando a conexão
        const client = await pool.connect();
        console.log("\nCriou pool de conexões no PostgreSQL!");

        const res = await client.query('SELECT NOW()');
        console.log(res.rows[0],"\n");
        client.release();

        //guardando para usar sempre o mesmo
        global.connection = pool;
        return pool.connect();
    }
}

async function selectAll(table) {
    try{
        const client = await connect();
        const res = await client.query(`SELECT * FROM ${table}`);
        return res.rows;
    }catch(e){
        return e
    }
}

async function insertMutuario(data) {
    try{
        const client = await connect();
        const sql = 'INSERT INTO mutuario(num_mutuario,nome,tipo) VALUES ($1,$2,$3);';
        const values = [data.num_mutuario, data.nome, data.tipo];
        return await client.query(sql, values);
    }catch(e){
        return e;
    }
    
}

module.exports = {selectAll,insertMutuario}