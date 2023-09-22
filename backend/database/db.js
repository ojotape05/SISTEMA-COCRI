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
                    c.id_processo,
                    cert.hist_junta_comercial, cert.cert_fgts, cert.cert_cnd,
                    cert.cadast_cnpj, cert.cert_trabalhista
                FROM
                    mutuario m
                INNER JOIN
                    compra c ON m.cpf_cnpj = c.mut_cpf_cnpj
                INNER JOIN
                    certidoes cert ON m.cpf_cnpj = cert.mut_cpf_cnpj
                WHERE
                    c.id_processo = ${id_processo};`);

                let mutuarios = res.rows.map( mut => {
                    (mut.tipo == 'PJ' ? mut.pj = true : mut.pj = false)
                    return mut
                })

                res = await client.query(`
                SELECT
                    v.*,
                    vda.id_processo,
                    cert.hist_junta_comercial, cert.cert_fgts, cert.cert_cnd,
                    cert.cadast_cnpj, cert.cert_trabalhista
                FROM
                    vendedor v
                INNER JOIN
                    venda vda ON v.cpf_cnpj = vda.vend_cpf_cnpj
                INNER JOIN
                    certidoes cert ON v.cpf_cnpj = cert.vend_cpf_cnpj
                WHERE
                    vda.id_processo = ${id_processo};`);

                let vendedores = res.rows.map( vend => {
                    (vend.tipo == 'PJ' ? vend.pj = true : vend.pj = false)
                    return vend
                })

                res = await client.query(`
                SELECT 
                    p.*
                FROM 
                    processo p
                WHERE
                    p.id_processo = ${id_processo};`);

                let processo = res.rows[0]
                processo.mutuario_ref = mutuarios[0].nome_mut
                processo.mutuario_ref_pj = (mutuarios[0].tipo == 'PJ' ? true : false)
                processo.vendedor_ref = vendedores[0].nome_vend
                processo.vendedor_ref_pj = (vendedores[0].tipo == 'PJ' ? true : false)
                processo.mutuarios = mutuarios
                processo.vendedores = vendedores

                console.log("processosDetails [filter]:",processo)

                resolve(processo);
            }
            client.release()
        }catch(e){
            reject(e)
        }
    }) 
}

async function insertVendedor(data) {
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            const sql = 'INSERT INTO vendedor(nome_vend,cpf_cnpj,tipo) VALUES ($1,$2,$3) ON CONFLICT DO NOTHING RETURNING cpf_cnpj;';
            const values = [data.nome_vend,data.cpf_cnpj, data.tipo];
            resolve(await client.query(sql, values))
            client.release()   
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
            const sql = 'INSERT INTO mutuario(cpf_cnpj,nome_mut,dt_nascimento_mut,tipo) VALUES ($1,$2,$3,$4) ON CONFLICT DO NOTHING RETURNING cpf_cnpj;';
            const values = [data.cpf_cnpj, data.nome_mut, data.dt_nascimento_mut, data.tipo];
            resolve((await client.query(sql, values)))
            client.release()
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
            client.release()
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
            client.release()
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

            const mutuarioPromises = data.mutuarios.map( async mut => {
                mut.id_processo = id_processo
                await insertMutuario(mut)
                return Promise.all([insertCompra(id_processo,mut.cpf_cnpj)])
            })
            
            const vendedorPromises = data.vendedores.map( async vend => {
                vend.id_processo = id_processo
                await insertVendedor(vend)
                return Promise.all([insertVenda(id_processo,vend.cpf_cnpj)])
            })

            Promise.all([...mutuarioPromises, ...vendedorPromises])
            .then(resultados => {
                console.log(resultados)
                resolve("Dados inseridos com sucesso")
            })
            .catch(error => {
                console.log(error)
                reject(error)
            });
            client.release()
        }
        catch(e){
            console.log(e)
            reject(e)
        } 
    })
       
}

async function triagem(data){
    console.log(data)
    return new Promise( async (resolve,reject) => {
        try{
            const client = await connect();
            let sql; let values;
            switch(data.insert){
                case 'dps':
                    if(data.dps_condicao == true){
                        sql = `
                            UPDATE processo
                            SET
                                dps_condicao = $1,
                                dps_status = $2
                            WHERE
                                id_processo = ${data.id_processo}
                        `;
                        values = [
                            data.dps_condicao,
                            data.dps_status
                        ];
                        await client.query(sql, values)
                        resolve("DPS Atualizada.")
                        break
                    }else{
                        sql = `
                            UPDATE processo
                            SET
                                dps_condicao = $1,
                                dps_status = $2
                            WHERE
                                id_processo = ${data.id_processo}
                        `;
                        values = [
                            data.dps_condicao,
                            null
                        ];
                        await client.query(sql, values)
                        resolve("DPS Atualizada.")
                        break
                    }
                case 'montagem':
                    sql = `
                        UPDATE processo
                        SET
                            montagem = $1
                        WHERE
                            id_processo = ${data.id_processo}
                    `;
                    values = [
                        data.montagem
                    ];
                    await client.query(sql, values)
                    resolve("Montagem Atualizada.")
                    break
                case 'certidoes':
                    try{
                        data.mutuarios.forEach( async mutuario => {
                            var sql = `
                                UPDATE certidoes
                                SET
                                    hist_junta_comercial = $3,
                                    cadast_cnpj = $4,
                                    cert_fgts = $5,
                                    cert_cnd = $6,
                                    cert_trabalhista = $7
                                WHERE
                                    id_processo = $1
                                    AND mut_cpf_cnpj = $2
                                RETURNING *;
                            `;

                            var values = [
                                data.id_processo,
                                mutuario.cpf_cnpj,
                                mutuario.docs[0].checked,
                                mutuario.docs[1].checked,
                                mutuario.docs[2].checked,
                                mutuario.docs[3].checked,
                                mutuario.docs[4].checked,
                            ];

                            const updateResult = await client.query(sql, values);

                            if (updateResult.rowCount === 0) {
                            // Se nenhum registro foi afetado, faça uma inserção
                            sql = `
                                INSERT INTO certidoes(mut_cpf_cnpj, id_processo, hist_junta_comercial, cadast_cnpj, cert_fgts, cert_cnd, cert_trabalhista)
                                VALUES($2, $1, $3, $4, $5, $6, $7)
                                RETURNING *;
                            `;

                            values = [
                                data.id_processo,
                                mutuario.cpf_cnpj,
                                mutuario.docs[0].checked,
                                mutuario.docs[1].checked,
                                mutuario.docs[2].checked,
                                mutuario.docs[3].checked,
                                mutuario.docs[4].checked,
                            ];

                            const insertResult = await client.query(sql, values);

                            console.log('Inserido novo registro:', insertResult.rows[0]);
                            } else {
                            console.log('Atualizado registro existente:', updateResult.rows[0]);
                            }

                        })

                        data.vendedores.forEach( async vendedor => {
                            var sql = `
                                UPDATE certidoes
                                SET
                                    hist_junta_comercial = $3,
                                    cadast_cnpj = $4,
                                    cert_fgts = $5,
                                    cert_cnd = $6,
                                    cert_trabalhista = $7
                                WHERE
                                    id_processo = $1
                                    AND vend_cpf_cnpj = $2
                                RETURNING *;
                            `;

                            var values = [
                                data.id_processo,
                                vendedor.cpf_cnpj,
                                vendedor.docs[0].checked,
                                vendedor.docs[1].checked,
                                vendedor.docs[2].checked,
                                vendedor.docs[3].checked,
                                vendedor.docs[4].checked,
                            ];

                            const updateResult = await client.query(sql, values);

                            if (updateResult.rowCount === 0) {
                            // Se nenhum registro foi afetado, faça uma inserção
                            sql = `
                                INSERT INTO certidoes(vend_cpf_cnpj, id_processo, hist_junta_comercial, cadast_cnpj, cert_fgts, cert_cnd, cert_trabalhista)
                                VALUES($2, $1, $3, $4, $5, $6, $7)
                                RETURNING *;
                            `;

                            values = [
                                data.id_processo,
                                vendedor.cpf_cnpj,
                                vendedor.docs[0].checked,
                                vendedor.docs[1].checked,
                                vendedor.docs[2].checked,
                                vendedor.docs[3].checked,
                                vendedor.docs[4].checked,
                            ];

                            const insertResult = await client.query(sql, values);

                            console.log('Inserido novo registro:', insertResult.rows[0]);
                            } else {
                            console.log('Atualizado registro existente:', updateResult.rows[0]);
                            }

                        })
                        resolve("Certidão atualizada")
                        client.resolve()
                    }catch(e){
                        reject(e)
                    }
                    break
            }
            client.release()
        }
        catch(e){
            console.log(e)
            reject(e)
        }
    })

}

module.exports = {processosDetails, insertAbertura, insertMutuario, triagem}