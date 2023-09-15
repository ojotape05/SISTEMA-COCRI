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

        const res = await client.query('SELECT NOW()');
        console.log(res.rows[0],"\n");
        client.release();

        //guardando para usar sempre o mesmo
        global.connection = pool;
        return pool.connect();
    }
}

async function processosDetails(id_processo) {
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            if(id_processo == null){
                let res = await client.query(`
                SELECT 
                    *
                FROM 
                    processo
                `);

                let processos = res.rows

                processos = processos.map( async (pr) => {
                    const id_processo = pr.id_processo

                    let res = await client.query(`
                    SELECT
                        m.*,
                        c.id_processo
                    FROM
                        mutuario m
                    INNER JOIN
                        compra c ON m.cpf_cnpj = c.mut_cpf_cnpj
                    WHERE
                        c.id_processo = ${id_processo};`);

                    const mutuarios = res.rows

                    res = await client.query(`
                    SELECT
                        v.*,
                        vda.id_processo
                    FROM
                        vendedor v
                    INNER JOIN
                        venda vda ON v.cpf_cnpj = vda.vend_cpf_cnpj
                    WHERE
                        vda.id_processo = ${id_processo};`);

                    const vendedores = res.rows

                    pr.mutuario_ref = mutuarios[0].nome_mut
                    pr.vendedor_ref = vendedores[0].nome_vend
                    pr.mutuarios = mutuarios
                    pr.vendedores = vendedores

                    return pr
                })

                Promise.all(processos)
                .then(processosProcessados => {
                    resolve(processosProcessados);
                })
                .catch(error => {
                    reject(error);
                });

            }else{
                let res = await client.query(`
                SELECT
                    m.*,
                    c.id_processo
                FROM
                    mutuario m
                INNER JOIN
                    compra c ON m.cpf_cnpj = c.mut_cpf_cnpj
                WHERE
                    c.id_processo = ${id_processo};`);

                const mutuarios = res.rows

                res = await client.query(`
                SELECT
                    v.*,
                    vda.id_processo
                FROM
                    vendedor v
                INNER JOIN
                    venda vda ON v.cpf_cnpj = vda.vend_cpf_cnpj
                WHERE
                    vda.id_processo = ${id_processo};`);

                const vendedores = res.rows

                res = await client.query(`
                SELECT 
                    p.*
                FROM 
                    processo p
                WHERE
                    p.id_processo = ${id_processo};`);

                let processo = res.rows[0]
                processo.mutuario_ref = mutuarios[0].nome_mut
                processo.vendedor_ref = vendedores[0].nome_vend
                processo.mutuarios = mutuarios
                processo.vendedores = vendedores

                console.log("processosDetails [filter]:",processo)

                resolve(processo);
            }
        }catch(e){
            reject(e)
        }
    }) 
}

async function insertVendedor(data) {
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            const sql = 'INSERT INTO vendedor(nome_vend,cpf_cnpj) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING cpf_cnpj;';
            const values = [data.nome_vend,data.cpf_cnpj];
            resolve(await client.query(sql, values))    
        }catch(e){
            console.log("Erro de conexão:",e)
            reject(e) 
        }
    })
}

async function insertMutuario(data) {
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            const sql = 'INSERT INTO mutuario(cpf_cnpj,nome_mut,dt_nascimento_mut) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING cpf_cnpj;';
            const values = [data.cpf_cnpj, data.nome_mut, data.dt_nascimento_mut];
            resolve((await client.query(sql, values)))
        }catch(e){
            console.log("Erro de conexão:",e)
            reject(e)
        }
    })
   
}

async function insertCompra(id_processo,cpf_cnpj){
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            const sql = 'INSERT INTO compra(mut_cpf_cnpj,id_processo) VALUES($1,$2)'
            const values = [cpf_cnpj,id_processo]
            resolve( await client.query(sql, values))
        }catch(e){
            console.log("Erro de conexão:",e)
            reject(e)
        }
    }) 
}

async function insertVenda(id_processo,cpf_cnpj){
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            const sql = 'INSERT INTO venda(vend_cpf_cnpj,id_processo) VALUES($1,$2)'
            const values = [cpf_cnpj,id_processo]
            resolve( await client.query(sql, values) )
        }catch(e){
            console.log("Erro de conexão:",e)
            reject( e )
        }
    })
      
}

async function insertAbertura(data) {
    return new Promise( async (resolve,reject) => {
        try{
            console.log(data)
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
                data.corresp.cnpj_corresp,
                data.corresp.nome_corresp,
                data.operacao
            ];
            const id_processo = (await client.query(sql, values)).rows[0].id_processo

            const mutuarioPromises = data.mutuarios.map( mut => {
                mut.id_processo = id_processo
                return Promise.all([insertMutuario(mut),insertCompra(id_processo,mut.cpf_cnpj)])
            })
            
            const vendedorPromises = data.vendedores.map( vend => {
                vend.id_processo = id_processo
                return Promise.all([insertVendedor(vend),insertVenda(id_processo,vend.cpf_cnpj)])
            })

            Promise.all([...mutuarioPromises, ...vendedorPromises])
            .then(resultados => {
                console.log(reusltados)
                resolve("Dados inseridos com sucesso")
            })
            .catch(error => {
                console.log(error)
                reject(error)
            });
            
        }
        catch(e){
            console.log(e)
            reject(e)
        } 
    })
       
}

async function triagem(data){
    return new Promise( async (resolve,reject) => {
        try{
            switch(data.insert){
                case 'dps':
                    const client = await connect();
                    const sql = `
                        UPDATE processo
                        SET 
                    `;
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
                        data.corresp.cnpj_corresp,
                        data.corresp.nome_corresp,
                        data.operacao
                    ];
                    break
            }
        }
        catch(e){

        }
    })

}

module.exports = {processosDetails,insertAbertura,insertMutuario}