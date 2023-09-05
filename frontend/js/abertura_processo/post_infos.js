// Captura de dados do formulário
if (document.querySelector('#aberturaProcesso')) {
    elem = document.querySelector('#aberturaProcesso')
    elem.addEventListener("submit", function (event) {
      event.preventDefault();

      tipo_taxa = document.querySelectorAll("[name=tipoTaxa]").forEach( el => {
        if(el.checked) return el.value
      })

      var numMutuario = parseInt(document.querySelector("#numMutuarios").textContent);
      var mutuarios = []
      for(var i = 0; i < numMutuario; i++){
        mutuarios.push({
          nome_mut: document.querySelectorAll("[name=mutuario]")[i].value,
          dt_nascimento_mut: document.querySelectorAll("[name=dt_nascimento_mut]")[i].value,
          num_mut: document.querySelectorAll("[name=num_Mutuario]")[i].value,
        })
      }

      var numVendedores = parseInt(document.querySelector("#numVendedores").textContent);
      var vendedores = []
      for(var i = 0; i < numVendedores; i++){
        vendedores.push({
          nome_vend: document.querySelectorAll('[name="vendedor"]')[i].value,
          num_vend: document.querySelectorAll('[name="num_Vendedor"]')[i].value
        })
      }

      json = {
        dt_entrada_gecri: document.getElementById("dataEntradaGecri").value,
        vl_compra_venda: parseFloat((document.querySelector("#valorCompraEVenda").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        vl_financiamento: parseFloat((document.querySelector("#valorFinanciamento").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        fgts: document.getElementById("fgts").checked,
        iq: document.getElementById("iq").checked,
        sist_amortizacao: document.getElementById("tipodeamortizacao").value,
        prazo: parseInt(document.getElementById("prazo").value),
        taxa: parseFloat((document.getElementById("taxa").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        tipo_taxa: tipo_taxa,
        agencia: {
          cid: document.getElementById("cid").value,
          nome_agencia: document.getElementById("agencia").value,
          sureg: document.getElementById("superintendencia").value
        },
        corresp: {
          nome_corresp: (document.getElementById("nomeCorrespondente").value != '' ? document.getElementById("nomeCorrespondente").value : null),
          cnpj_corresp: (document.getElementById("cnpjCorrespondente").value != '' ? document.getElementById("cnpjCorrespondente").value : null)
        },
        operacao: document.querySelector("#tipodeoperacao").value,
        mutuarios,
        vendedores
      }

      fetch('/abertura-post',{
        method:'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(json)
      })
      .then( (res) => {
        alert("Dados inseridos com sucesso!")
      })
      .catch( (res) => {console.log(res)})

    })
  }
  
