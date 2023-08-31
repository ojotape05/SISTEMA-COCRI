function teste(option) {

    if (option != null) {
      alert("Modo de teste")
      function dadosGerais() {
        document.querySelector("#dataEntradaGecri").value = "2023-08-02"
        document.querySelector("#valorFinanciamento").value = 227787, 17

        document.querySelector("#mutuario").value = "SAILE TOMAZELLI"
        document.querySelector("#num_Mutuario").value = "131.950.177-09"

        document.querySelector("#cid").value = "236"
      }

      if (option == 0) {
        dadosGerais()
      }
      else if (option == 1) { //Com correspondente
        dadosGerais()
        document.querySelector("#cnpjCorrespondente").value = "13.056.230/0001-14"
      }
    }


  }

  //teste(0) // 0 -> Sem correspondente / 1 -> Com correspondente / NULL or DIFF -> Sem teste
if (document.querySelector('#cid')) {
  elem = document.querySelector('#cid')
  elem.addEventListener("change", function (event) {
      fetch('../backend/data/agencias.json') // Faz a requisição do arquivo JSON
        .then(response => response.json()) // Converte a resposta para JSON
        .then(agencias=> {
          agencias = agencias[0]
          cids = Object.values(agencias.cid)
          indice = cids.indexOf(parseInt(event.target.value))
          document.getElementById("agencia").value = agencias.nome_agencia[indice]
          document.getElementById("superintendencia").value = agencias.nome_superintendencia[indice]
        }) // Chama a função para exibir os dados
        .catch(error => console.error('Erro ao carregar o JSON:', error));
    
  });
}

if (document.querySelector('input[name="correspondente?"]')) {
  document.querySelectorAll('input[name="correspondente?"]').forEach((elem) => {
    elem.addEventListener("change", function (event) {
      var item = event.target.value;
      if (item == 1) {
        document.getElementById("correspDiv").style.display = "block"
        document.querySelector("#cnpjCorrespondente").required = true
      }
      else if (item == 0) {
        document.getElementById("correspDiv").style.display = "none"
        document.querySelector("#cnpjCorrespondente").required = false
      }
    });
  });
}

if (document.querySelector('#cnpjCorrespondente')) {
  elem = document.querySelector('#cnpjCorrespondente')
  elem.addEventListener("change", function (event) {
      fetch('./js/data/correspondentes.json') // Faz a requisição do arquivo JSON
        .then(response => response.json()) // Converte a resposta para JSON
        .then(correspondentes => {
            var cnpj = event.target.value;
            cnpj = parseInt(cnpj.replace(/[^a-zA-Z0-9]/g, ""))
            for (corresp of correspondentes) {
                if (corresp.correspondente == cnpj) {
                document.getElementById("nomeCorrespondente").value = corresp.email
                }
            }
        }) // Chama a função para exibir os dados
        .catch(error => console.error('Erro ao carregar o JSON:', error));
    
  });
}

if (document.querySelector('#cpfMutuario')) {
  elem = document.querySelector('#cpfMutuario')
  elem.addEventListener("change", function (event) {
    var cpf = event.target.value;
    cpf = parseInt(cpf.replace(/[^a-zA-Z0-9]/g, ""))
    console.log(cpf)
  });
}

if (document.querySelector('[type="checkbox"]')) {
  document.querySelectorAll('[type="checkbox"]').forEach((elem) => {
    elem.addEventListener("change", function (event) {
      if (event.target.id == "portab" && event.target.checked == true) {
        document.querySelector("#iq").checked = false
        document.querySelector("#fgts").checked = false
      } else if (event.target.id == "iq" && event.target.checked == true) {
        document.querySelector("#portab").checked = false
      } else if (event.target.id == "fgts" && event.target.checked == true){
        document.querySelector("#portab").checked = false
      }
    })
  })
}

elems = document.querySelectorAll('.real')
.forEach(elem => {
  elem.addEventListener("change", function (event) {
    // Converter o valor para formato de número com duas casas decimais
    
    valor = event.target.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  
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
  
    // Adicionar o símbolo da moeda (R$) na frente do valor
    resultado = 'R$ ' + resultado;
  
    event.target.value = resultado;
  });
})


function add(tipo){
  if (tipo == "mut"){
    var span = document.querySelector("#numMutuarios")
    var num = parseInt(span.textContent)
    if(num + 1 <= 4){
      num+=1; divMuts = document.querySelector("[name='listaMutuario']"); divMut = divMuts.children[0]
      divMuts.appendChild(divMut.cloneNode(true))
      span.textContent = num
    }
  }
  else if (tipo == "vend") {
    var span = document.querySelector("#numVendedores")
    var num = parseInt(span.textContent)
    if(num + 1 <= 4){
      num+=1; divVends = document.querySelector("[name='listaVendedores']"); divVend = divVends.children[0]
      divVends.appendChild(divVend.cloneNode(true))
      span.textContent = num
    }

  }
  
}

function excl(tipo){
  if (tipo == "mut"){
    var span = document.querySelector("#numMutuarios")
    var num = parseInt(span.textContent)
    if(num - 1 >= 1){
      num-=1; divMuts = document.querySelector("[name='listaMutuario']"); divMut = divMuts.children[divMuts.children.length - 1]
      divMuts.removeChild(divMut)
      span.textContent = num
    }
  }
  else if (tipo == "vend") {
    var span = document.querySelector("#numVendedores")
    var num = parseInt(span.textContent)
    if(num - 1 >= 1){
      num-=1; divVends = document.querySelector("[name='listaVendedores']"); divVend = divVends.children[divVends.children.length - 1]
      divVends.removeChild(divVend)
      span.textContent = num
    }
  }
}