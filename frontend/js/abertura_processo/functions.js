if (document.querySelector('#cid')) {
  cid = document.querySelector('#cid')
  cid.addEventListener("change", function (event) {
      fetch('/agencias') // Faz a requisição do arquivo JSON
        .then(response => response.json()) // Converte a resposta para JSON
        .then(response => {
          const agencias = response.agencias
          try{
            var agencia = agencias.filter(el => el.cid === parseInt(cid.value))[0]
            document.getElementById("agencia").value = agencia.nome_agencia
            document.getElementById("superintendencia").value = agencia.nome_superintendencia
          }
          catch(e){
            console.log("Erro ao filtrar agencia:",e)
            document.getElementById("agencia").value = "Não encontrado"
            document.getElementById("superintendencia").value = "Não encontrado"
          }
          
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
      fetch('/correspondentes') // Faz a requisição do arquivo JSON
        .then(response => response.json()) // Converte a resposta para JSON
        .then(response => {
            const correspondentes = response.correspondentes
            var cnpj = formatarCNPJ(event.target.value)
            try{
              var correspondente = correspondentes.filter(el => el.CNPJ === cnpj)[0]
              document.querySelector("#nomeCorrespondente").value = correspondente.NomeFantasia
            }
            catch(e){
              console.log("Erro ao filtrar correspondente:",e)
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
      console.log(divMut.cloneNode(true))
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

function formatarCNPJ(cnpj) {
  // Remove qualquer caractere não numérico do CNPJ
  cnpj = cnpj.replace(/[^\d]/g, '');

  // Formata o CNPJ no padrão com pontos, barras e traços
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}