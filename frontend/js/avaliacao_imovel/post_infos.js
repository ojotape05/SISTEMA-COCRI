function pendencia(){
    fetch('./js/data/processos.json') // Faz a requisição do arquivo JSON
    .then(response => response.json()) // Converte a resposta para JSON
    .then(processos => {

        pendencias = [{
            id: 3,
            id_processo: idProcesso,
            id_documento: 1,
            id_agencia: processos.id_agencia[idProcesso],
            etapa: "Avaliação",
            dt_consulta: new Date()
        },
        {
            id: 3,
            id_processo: idProcesso,
            id_documento: 3,
            id_agencia: processos.id_agencia[idProcesso],
            etapa: "Avaliação",
            dt_consulta: new Date()   
        }]

        alert("Pendencia aberta com sucesso!")
        console.log(pendencias)

    }) // Chama a função para exibir os dados
    .catch(error => console.error('Erro ao carregar o JSON:', error));
}

function datas_tarifa(){
    if(document.getElementById("dt_solicitacao").value){
        console.log(document.getElementById("dt_solicitacao").value)
    }
    if(document.getElementById("dt_recebimento").value){
        console.log(document.getElementById("dt_recebimento").value)
    }
}