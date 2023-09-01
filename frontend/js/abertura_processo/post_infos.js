// Captura de dados do formulário
if (document.querySelector('#aberturaProcesso')) {
    elem = document.querySelector('#aberturaProcesso')
    elem.addEventListener("submit", function (event) {
      event.preventDefault();

      tipoTaxa = document.querySelectorAll("[name=tipoTaxa]").forEach( el => {
        if(el.checked) return el.value
      })

      tiposMut = document.querySelectorAll("[name=tipoMutuario]")
      .map( el => el.checked == true )

      var numMutuario = parseInt(document.querySelector("#numMutuarios").textContent); var mutuarios = []
      for(var i = 0; i < numMutuario; i++){
        json = {
          nome_mut: document.querySelectorAll("[name=mutuario]")[i].value,
          dt_nascimento_mut: document.querySelectorAll("[name=dt_nascimento_mut]")[i].value,
          num_mut: document.querySelectorAll("[name=num_Mutuario]")[i].value,
        }
        tipo = document.querySelectorAll("[name=num_Mutuario]")[i].value
      }

      json = {
        dt_entrada_gecri: document.getElementById("dataEntradaGecri").value,
        vl_compra_venda: parseFloat((document.querySelector("#valorCompraEVenda").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        vl_financiamento: parseFloat((document.querySelector("#valorFinanciamento").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        fgts: document.getElementById("fgts").checked,
        iq: document.getElementById("fgts").checked,
        portab: document.getElementById("portab").checked,
        sist_amortizacao: document.getElementById("tipodeamortizacao").value,
        prazo: document.getElementById("prazo").value,
        taxa: parseFloat((document.getElementById("taxa").value).replace(/[^0-9,]+/gm,"").replace(",",".")),
        tipoTaxa: tipoTaxa,
        agencia: {
          cid: document.getElementById("cid").value,
          nome_agencia: document.getElementById("agencia").value,
          sureg: document.getElementById("superintendencia").value
        },
        corresp: {
          nome_correspodente: document.getElementById("nomeCorrespondente").value,
          cnpj_correspondente: document.getElementById("cnpjCorrespondente").value
        },
        
      }
    })
  }
  
