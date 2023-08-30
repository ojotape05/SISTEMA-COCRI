idProcesso = 3
loadInfos(idProcesso)

function loadInfos(idProcesso){

    fetch('./js/data/processos.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(processos => {

        console.log(processos)
        console.log(processos.valor_financiamento[idProcesso])   
        document.querySelector("#valorFinanciamento").value = formataReal(processos.valor_financiamento[idProcesso])
        document.querySelector("#idProcesso").textContent = document.querySelector("#idProcesso").textContent.replace("$$",processos.id[idProcesso])
        document.querySelector("#fgts").checked = true
        

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));

    
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