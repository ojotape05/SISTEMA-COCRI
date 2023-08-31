require("dotenv").config();
async function start(){
    const db = require("./db")
   
    /*res = db.insertMutuario({
        num_mutuario: 1234567890,
        nome: 'Arlindo Cruz',
        tipo: 'PF'
    })
    console.log(res)*/

    res = await db.selectAll('mutuario')
    console.log("Retorno mutuarios:",res)
}

start()
