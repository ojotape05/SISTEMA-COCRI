document.querySelector("#tratativaPendencia")
.addEventListener("submit", event => {
    lancarPendencia(event)    
})

document.querySelector("#certidoesForm")
.addEventListener("submit", event => {
    checarCertidoes(event)    
})

function lancarPendencia(event){

    event.preventDefault()
    if(document.querySelectorAll(".divNovaPendencia").length > 0){
        if( confirm("Tem certeza que deseja lançar essa pendência?")){
            for( [index, el] of document.querySelectorAll(".divNovaPendencia").entries() ){
                tipo = el.children[0].textContent.split(" - ")[0].trim()
                doc = el.children[0].textContent.split(" - ")[1].trim()
                
                documento = {
                    id: el.value,
                    tipo: tipo,
                    doc: doc
                }
                console.log("Documento "+(index+1)+": ",documento)
    
                pendencia = {
                    id: (index+1),
                    id_processo: 1,
                    id_agencia: 3,
                    id_documento: documento.id,
                    etapa: "Triagem",
                    dt_consulta: new Date().toJSON().slice(0,10),
                    obs: el.children[1].children[0].value
                }
                console.log("Pendencia "+(index+1)+": ",pendencia)
            }
    
            triagem = {
                id: 1,
                id_processo: 1,
                id_usuario: 2,
                dt_inicio: new Date().toJSON().slice(0,10),
                dt_final: null,
                problema: true,
                sla: null
            }
            console.log("Triagem 1:",triagem)
    
    
        }
    }
    else{
        alert("Nenhuma pendência adicionada, verifique.")
    }
    
}

function checarCertidoes(event){

}