titulosEtapas = document.querySelectorAll(".divTitulosEtapas")
sanfonado(titulosEtapas)  
function sanfonado(elements){
    elements.forEach( el => {
        el.addEventListener("click", event => {
            
            if(event.isTrusted){
                etapaDiv = el.parentElement
                conteudoEtapa = etapaDiv.children[1]
                if (conteudoEtapa.style.display == "none" || conteudoEtapa.style.display == "") {
                    etapaDiv.style.height = "100%"
                    conteudoEtapa.style.display = "flex"
                    switch(etapaDiv.id){
                        case "dps":
                            inputDefDPS = document.querySelectorAll('[name="dps?"]')
                            if(inputDefDPS[0].checked === false || inputDefDPS[1].checked === true){
                                etapaDiv.style.height = "20rem"
                                break
                            }else{
                                etapaDiv.style.height = "25rem"
                                break
                            }
                        case "montagem":
                            etapaDiv.style.height = "17rem"
                            break
                    }
                }else{
                    etapaDiv.style.height = ""
                    conteudoEtapa.style.display = "none"
                }  
            }
        })
    })
}

statusDps_div = document.querySelector("#statusDps-div")
document.querySelectorAll('[name="dps?"]')
.forEach( dpsinput => {
    dpsinput.addEventListener("change", event => {
        if(event.isTrusted){
            if(dpsinput.checked && dpsinput.value == '1'){
                statusDps_div.style.display = "flex"
                titulosEtapas[0].parentElement.style.height = "25rem"
            }
            else if(dpsinput.checked && dpsinput.value == '0'){
                statusDps_div.style.display = "none"
                titulosEtapas[0].parentElement.style.height = "20rem"
            }
        }
    })
})

function loadOptions(options) { //el.selected = true
    select = document.querySelector("#selectDoc")
    select.innerHTML = "";
    for ([index,option] of options.entries()) {
        optionEl = document.createElement("option")
        optionEl.setAttribute("class", "searchOptions")
        optionEl.setAttribute("value", option.value)
        optionEl.textContent = option.textContent
        if (index == 0) {
            optionEl.selected = true
            select.appendChild(optionEl)
        }
        else select.appendChild(optionEl)
    }
}

//loadOptions(defaultOptions)


// Adicionar pendencias ao quadro

function checarDocs(){
    pendenciasText = []; pendenciasCadastradas = document.querySelectorAll(".novaPendencia")
    pendenciasCadastradas.forEach( pendencia => {
        docTitle = pendencia.textContent
        pendenciasText.push(docTitle)
    })
    id = 1 //Para colocar valores de ID 
    document.querySelectorAll(".columns input").forEach( optionPendencia => {
        docTitleOption = optionPendencia.parentElement.parentElement.parentElement.children[0].textContent+" - "+optionPendencia.nextElementSibling.textContent
        optionPendencia.value = id
        if(optionPendencia.checked){
            if(pendenciasCadastradas.length > 0){
                if(!pendenciasText.includes(docTitleOption)) cadastrarPendencia(optionPendencia)
            }else cadastrarPendencia(optionPendencia)            
        }
        id++            
    })
}

function excluirPendencias(){
    document.querySelector("#pendenciasDiv").innerHTML = ""
}

// Formatação de box de pendência
function cadastrarPendencia(optionPendencia){

    const divNovaPendencia = document.createElement('div');
    divNovaPendencia.setAttribute("class","divNovaPendencia")
    divNovaPendencia.value = parseInt(optionPendencia.value);

    const novaPendencia = document.createElement('div');
    novaPendencia.setAttribute("class","novaPendencia")

    const divTextarea = document.createElement('div');
    const textarea = document.createElement('textarea');
    textarea.setAttribute("class","observacaoPendencia")
    textarea.placeholder = "Você pode deixar uma observação"
    textarea.id = "obsPendencia"
    textarea.cols = 30
    textarea.rows = 5

    const spanDoc = document.createElement('span');
    const docType = optionPendencia.parentElement.parentElement.parentElement.children[0].textContent
    var doc = optionPendencia.nextElementSibling.textContent
    spanDoc.textContent = docType+" - "+doc;
    spanDoc.style.display = "flex";
    spanDoc.style.justifyContent = "center";

    const i  = document.createElement('i')
    i.setAttribute("class","gg-trash")
    i.setAttribute("onclick","excluirPendencia(this)")

    novaPendencia.appendChild(spanDoc)
    novaPendencia.appendChild(i)

    divTextarea.appendChild(textarea)
    
    divNovaPendencia.appendChild(novaPendencia);
    divNovaPendencia.appendChild(divTextarea);

    const pendenciasDiv = document.getElementById('pendenciasDiv');
    pendenciasDiv.appendChild(divNovaPendencia);

    filtraTitulos()
}


//Exclusão de pendência
function excluirPendencia(elemento){
    divPendencias = elemento.parentNode.parentNode.parentNode
    pendenciaExcluir = elemento.parentNode.parentNode
    if( confirm("Deseja excluir a pendência: '"+elemento.previousElementSibling.textContent+"'?") == true){
        divPendencias.removeChild(pendenciaExcluir)
    }
}

// Filtrar titulos da box de documento
function filtraTitulos(){
    if(document.querySelectorAll(".novaPendencia")){
        document.querySelectorAll(".novaPendencia")
        .forEach( el => {
            boxTitle = el.children[0]
            if(boxTitle.textContent.includes("Comprovante"))
            {boxTitle.textContent = boxTitle.textContent.replace("Comprovante","Compr.")}
        })
    }
    
}