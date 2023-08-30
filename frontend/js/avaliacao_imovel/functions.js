document.querySelectorAll(".valorReal").forEach( el => {
    el.addEventListener("change", event =>{
        event.target.value = formataReal(event.target.value)
        calculoEnquadramento()
    })
})

document.querySelectorAll('[name="sistemaAmortizacao"]').forEach( el => {
    el.addEventListener("change", event => {
        calculoEnquadramento()
    })
})

const regex = /[^0-9,]+/gm;
idProcesso = 3
loadInfos(idProcesso)

function calculoEnquadramento(){
    if(document.querySelector("#valorAvaliacao").value && document.querySelector("#valorCompraVenda").value){

        valorMaximo = 0.0
        valorFinanciamento = parseFloat((document.querySelector("#valorFinanciamento").value).replace(regex,""))

        if(document.querySelector("#sac").checked){

            vlAvaliacao = document.querySelector("#valorAvaliacao").value
            vlAvaliacao = parseFloat(vlAvaliacao.replace(regex,""))
        
            vlCompVend = document.querySelector("#valorCompraVenda").value
            vlCompVend = parseFloat(vlCompVend.replaceAll(regex,""))
        
            if(vlAvaliacao <= vlCompVend){ menorValor = vlAvaliacao}
            else{menorValor = vlCompVend}
            
            valorMaximo = menorValor * 0.9
            document.querySelector("#valorMax").value = formataReal(valorMaximo)
        }
        else if(document.querySelector("#price").checked){
            vlAvaliacao = document.querySelector("#valorAvaliacao").value
            vlAvaliacao = parseFloat(vlAvaliacao.replace(regex,""))
        
            vlCompVend = document.querySelector("#valorCompraVenda").value
            vlCompVend = parseFloat(vlCompVend.replaceAll(regex,""))
        
            if(vlAvaliacao <= vlCompVend){ menorValor = vlAvaliacao}
            else{menorValor = vlCompVend}
            
            valorMaximo = menorValor * 0.8
            document.querySelector("#valorMax").value = formataReal(valorMaximo)
        }

        enquadramento = document.querySelector("#enquadramento")
        if(valorMaximo < valorFinanciamento){
            enquadramento.style.backgroundColor = "#ff000080"
            enquadramento.style.color = "#b90000"
            enquadramento.textContent = "Financiamento acima do máximo permitido"
            document.querySelector("#valorComplemento").value = formataReal(valorFinanciamento - valorMaximo)
            document.querySelector("#divPendencia").style.display = "flex"
        }else{
            enquadramento.style.backgroundColor = "#a0ff87"
            enquadramento.style.color = "#24ab00"
            enquadramento.textContent = "Financimento Permitido"
            document.querySelector("#valorComplemento").value = "-.-"
            document.querySelector("#divPendencia").style.display = "none"
        }
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

function loadInfos(idProcesso){

    fetch('../js/data/processos.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(processos => {

        console.log(processos)
        console.log(processos.valor_financiamento[idProcesso])   
        document.querySelector("#valorFinanciamento").value = formataReal(processos.valor_financiamento[idProcesso])

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));
        
}

// loadInfos(prompt("Digite um ID de processo (Teste PJ = 7)","3")) //7 == PJ