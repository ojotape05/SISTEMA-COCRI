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

async function insertVendedor(data) {
    console.log("vend:",data)
    try{
        const client = await connect();
        const sql = 'INSERT INTO vendedor(nome_vend,num_vend,id_processo) VALUES ($1,$2,$3);';
        const values = [data.nome_vend,data.num_vend,data.id_processo];
        return await client.query(sql, values);
    }catch(e){
        console.log(e)
        return e;
    }
    
}

async function insertMutuario(data) {
    console.log("mutuario:",data)
    try{
        const client = await connect();
        const sql = 'INSERT INTO mutuario(num_mut,nome_mut,dt_nascimento_mut,id_processo) VALUES ($1,$2,$3,$4 RETURNING cpf_cnpj;';
        const values = [data.num_mut, data.nome_mut, data.dt_nascimento_mut,data.id_processo];
        const cpf_cnpj = (await client.query(sql, values)).rows[0].cpf_cnpj
        return cpf_cnpj
    }catch(e){
        console.log(e)
        return e;
    }
    
}

async function insertCompra(id_processo,cpf_cnpj){
    try{
        const client = await connect();
        const sql = 'INSERT INTO compra(mut_cpf_cnpj,id_processo) VALUES($1,$2)'
        const values = [cpf_cnpj,id_processo]
        return await client.query(sql, values)
    }
    catch(e){
        console.log("insertCompra:",e)
        return e
    }
}

async function insertAbertura(data) {
    try{
        const client = await connect();
        const sql = 'INSERT INTO processo(dt_entrada_gecri,vl_compra_venda,vl_financiamento,fgts,iq,sist_amortizacao,prazo,taxa,tipo_taxa,cid,nome_agencia,sureg,cnpj_corresp,nome_corresp,operacao) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id_processo;';
        const values = [
            data.dt_entrada_gecri,
            data.vl_compra_venda,
            data.vl_financiamento,
            data.fgts,
            data.iq,
            data.sist_amortizacao,
            data.prazo,
            data.taxa,
            data.tipo_taxa,
            data.agencia.cid,
            data.agencia.nome_agencia,
            data.agencia.sureg,
            data.corresp.cnpj_correspondente,
            data.corresp.nome_correspondente,
            data.operacao
        ];
        const id_processo = (await client.query(sql, values)).rows[0].id_processo
        console.log(id_processo)
        for(mut of data.mutuarios){
            mut.id_processo = id_processo
            const cpf_cnpj = insertMutuario(mut)
            insertCompra(id_processo,cpf_cnpj)
        }
        for(vend of data.vendedores){
            vend.id_processo = id_processo
            insertVendedor(vend)
        }
        return {status:202};
    }catch(e){
        console.log(e)
        return e;
    }
    
}

module.exports = {selectAll,insertAbertura,insertMutuario}