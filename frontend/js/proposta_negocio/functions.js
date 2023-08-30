infosPnForm = document.querySelectorAll("b")

document.querySelector("#codBem")
.addEventListener("change", event => {
    fetch('./js/data/bens.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(bens => {
        if(bens.tipos[event.target.value]){
            document.querySelector("#tipoBem").value = bens.tipos[event.target.value]
            infosPnForm[2].textContent = document.querySelector("#codBem").value + " ("+document.querySelector("#tipoBem").value+")"
            infosPnForm[18].textContent = document.querySelector("#codBem").value + " - 30 - 100"
        }else{
            document.querySelector("#tipoBem").value = "Não encontrado"
            infosPnForm[2].textContent = ""
            infosPnForm[18].textContent = ""
        }

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));
})

document.querySelector("#descricaoImovel")
.addEventListener("keyup", event => {
    infosPnForm[9].textContent = event.target.value
})

function formataData(data){
    datalist = data.split("-")
    novaData = datalist[2]+"/"+datalist[1]+"/"+datalist[0]
    return novaData
}

function loadAvaliadorasInfos(idAvaliadora){
    fetch('./js/data/avaliadoras.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(avaliadoras => {

        fetch('./js/data/tratativa_avaliacao.json') // Faz a requisição do arquivo JSON
        .then(response => response.json()) // Converte a resposta para JSON
        .then(avaliacoes => {

            document.querySelector("#cnpjAvaliadora").value = avaliadoras[idAvaliadora].CNPJ
            infosPnForm[8].textContent = avaliadoras[idAvaliadora].CNPJ

            document.querySelector("#empresaAvaliadora").value = avaliadoras[idAvaliadora].EMPRESA
            infosPnForm[7].textContent = avaliadoras[idAvaliadora].EMPRESA

            document.querySelector("#valorAvaliacao").value = formataReal(avaliacoes.valor[idAvaliadora])
            infosPnForm[5].textContent = formataReal(avaliacoes.valor[idAvaliadora])

            document.querySelector("#dataAvaliacaoImovel").value = avaliacoes.dt_final[idAvaliadora]
            infosPnForm[6].textContent = formataData(avaliacoes.dt_final[idAvaliadora])

        }) // Chama a função para exibir os dados
        .catch(error => console.error('Erro ao carregar o JSON:', error));

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));
}

function loadMutuarioInfos(idMutuario){
    fetch('./js/data/mutuarios.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(mutuarios => {
        console.log(mutuarios)

        nome = mutuarios.nome[idMutuario]
        document.querySelector("#nomeMutuario").value = nome

        infosPnForm[0].textContent = nome
        infosPnForm[1].textContent = nome
        infosPnForm[10].textContent = nome

        numMutuario = formata(mutuarios.identificacao_mutuario[idMutuario],mutuarios.tipo[idMutuario])
        document.querySelector("#numMutuario").value = numMutuario

        infosPnForm[11].textContent = numMutuario   

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));
    
}

function loadInfos(idProcesso){

    fetch('./js/data/processos.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(processos => {

        console.log(processos)
    
        idMutuario = processos.id_mutuario[idProcesso]
        idAvaliadora = processos.id_tratativa_avaliacao[idProcesso]
        
        loadMutuarioInfos(idMutuario)
        loadAvaliadorasInfos(idAvaliadora)
        
        //Valor fixos
        document.querySelector("#valorFinanciamento").value = formataReal(processos.valor_financiamento[idProcesso])
        infosPnForm[13].textContent = formataReal(processos.valor_financiamento[idProcesso])
        
        infosPnForm[16].textContent = "SAC"

        document.querySelector("#taxa").value = "8,99% aa"
        infosPnForm[15].textContent = "8,99% aa"

        document.querySelector("#prazo").value = "420"
        infosPnForm[14].textContent = "420"

        document.querySelector("#produto").value = "201-1"
        infosPnForm[12].textContent = "201-1"

        alert("Valores de sac, taxa, produto e prazo estão fixos")
        

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));

    
}

loadInfos(prompt("Digite um ID de processo (Teste PJ = 7)","3")) //7 == PJ

function formata(numMutuario,tipo){
    numMutuario = numMutuario.toString()
    console.log(numMutuario,tipo,numMutuario.length)

    if(tipo == "PF"){
        cpf = ""; 
        for([index,i] of numMutuario.split("").entries()){
            switch(index){
                case 2:
                    cpf+=i
                    cpf+="."
                    break
                case 5:
                    cpf+=i
                    cpf+="."
                    break
                case 8:
                    cpf+=i
                    cpf+="-"
                    break
                default:
                    cpf+=i
                    break
            }
        }
        return cpf
    }else if (tipo == "PJ"){ // temos q corrigir dps
        if(numMutuario.length == 11) numMutuario = "152"+numMutuario //para corrigir problema do bd
        cnpj = ""
        for([index,i] of numMutuario.split("").entries()){
            switch(index){
                case 1:
                    cnpj+=i
                    cnpj+="."
                    break
                case 4:
                    cnpj+=i
                    cnpj+="."
                    break
                case 7:
                    cnpj+=i
                    cnpj+="/"
                    break
                case 11:
                    cnpj+=i
                    cnpj+="-"
                    break
                default:
                    cnpj+=i
                    break
            }
        }
        return cnpj
    }
    
    
}

function formataReal(value){
    // Converter o valor para formato de número com duas casas decimais
      
    valor = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Separar a parte inteira da parte decimal
    var partes = valor.split(',');
    var inteiro = partes[0];
    var decimal = partes.length > 1 ? ',' + partes[1] : ',00';

    // Adicionar pontos para separar os milhares
    var milhares = /(\d)(?=(\d{3})+$)/g;
    inteiro = inteiro.replace(milhares, '$1.');

    // Concatenar a parte inteira e a parte decimal
    var resultado = inteiro + decimal;
    resultado = resultado.replace("R$ ","")
    resultado = resultado.replace("R$","")

    // Adicionar o símbolo da moeda (R$) na frente do valor
    resultado = 'R$ ' + resultado;

    return resultado;
}

for([index,el] of infosPnForm.entries()){
    console.log(index,el)
}