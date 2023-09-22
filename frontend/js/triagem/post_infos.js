const link = window.location.href
const context_id_processo = parseInt(link.split('id_processo=')[1])

document.querySelector("#tratativaPendencia")
.addEventListener("submit", event => {
    lancarPendencia(event)    
})

document.querySelector("#montagemForm")
.addEventListener("submit", event => {
    changeMontagem(event)    
})

document.querySelector("#certidoesForm")
.addEventListener("submit", event => {
    changeCertidoes(event)    
})

document.querySelector("#formDps")
.addEventListener("submit", event => {
    console.log("teste")
    changeDps(event)    
})

function changeDps(event){
    event.preventDefault()
    
    var dps_condicao;
    document.querySelectorAll("[name='dps?']")
    .forEach( el => {
        if(el.checked){
            dps_condicao = el.value
        }
    })
    console.log(dps_condicao)
    /*if(dps_condicao == "true"){
        var dps_status;
        document.querySelectorAll("[name='statusdps']")
        .forEach( el => {
            if(el.checked){
                dps_status = el.value
            }
        })
    }*/

    json = {
        insert: 'dps',
        dps_condicao: (dps_condicao == 'true' ? true : false),
        dps_status,
        id_processo: context_id_processo
    }

    console.log(json)

    fetch('/triagem-post', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
        alert(res.message)
    })
    .catch( err => {
        alert("Ocorreu algum erro, tente novamente")
        console.log(err)
    })
}

function lancarPendencia(event){

    event.preventDefault()
    if(document.querySelectorAll(".divNovaPendencia").length > 0){
        if( confirm("Tem certeza que deseja lançar essa pendência?")){
            for( [index, el] of document.querySelectorAll(".divNovaPendencia").entries() ){
                tipo = el.children[0].textContent.split(" - ")[0].trim()
                doc = el.children[0].textContent.split(" - ")[1].trim()
    
                pendencia = {
                    id_processo: context_id_processo,
                    categoria: tipo,
                    documento: doc,
                    descricao: el.children[1].children[0].value,
                    etapa: "Triagem",
                    dt_registro: new Date().toJSON().slice(0,10)
                }
                console.log("Pendencia "+(index+1)+": ",pendencia)
            }
        }
    }
    else{
        alert("Nenhuma pendência adicionada, verifique.")
    }
    
}

function changeMontagem(event){
    event.preventDefault()

    let montagem;
    document.querySelectorAll("[name='montagem?']")
    .forEach( el => {
        if(el.checked) montagem = el.value
    })

    json = {
        insert: 'montagem',
        montagem: (montagem == 'true' ? true : false),
        id_processo: context_id_processo
    }

    console.log(json)

    fetch('/triagem-post', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
    .then((res) => res.json())
    .then((res) => {
        alert(res.message)
    })

    
}

function changeCertidoes(event){
    event.preventDefault();

    // Mutuarios
    let mutuarios = []
    for(var x = 0; x < 4; x++){
        const inputs_docsMut = document.querySelectorAll('.docsMut'+x)
        if( inputs_docsMut.length > 0 ){
            let docsMut = []
            for(var input of inputs_docsMut){
                var doc = {
                    nome: input.id.substring(0,input.id.length - 1),
                    checked: input.checked
                }
                docsMut.push(doc)
            }
            const json = {
                "nome": document.querySelector("#nome_mutuario"+x).value,
                "cpf_cnpj": document.querySelector("#num_Mutuario"+x).value,
                "docs": docsMut
            }
            console.log(json)
            mutuarios.push(json)
        }
    }

    // Vendedores
    let vendedores = []
    for(var x = 0; x < 4; x++){
        const inputs_docsVend = document.querySelectorAll('.docsVend'+x)
        if( inputs_docsVend.length > 0 ){
            let docsVend = []
            for(var input of inputs_docsVend){
                var doc = {
                    nome: input.id.substring(0,input.id.length - 1),
                    checked: input.checked
                }
                docsVend.push(doc)
            }
            const json = {
                "nome": document.querySelector("#nome_vendedor"+x).value,
                "cpf_cnpj": document.querySelector("#num_Vendedor"+x).value,
                "docs": docsVend
            }
            console.log(json)
            vendedores.push(json)
        }
    }

    const json = {
        insert: 'certidoes',
        id_processo: context_id_processo,
        mutuarios,
        vendedores
    }

    fetch('/triagem-post', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
    })
    .then((res) => res.json())
    .then((res) => {
        console.log(res)
        alert(res.message)
    })
    .catch( err => {
        alert("Ocorreu algum erro, tente novamente")
        console.log(err)
    })

}