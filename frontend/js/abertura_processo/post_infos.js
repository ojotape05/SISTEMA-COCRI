// Captura de dados do formulário
if (document.querySelector('#aberturaProcesso')) {
    elem = document.querySelector('#aberturaProcesso')
    elem.addEventListener("submit", function (event) {
      event.preventDefault(); infos = {}
      document.querySelectorAll(".form-control").forEach((elem) => {
        if(elem.id == "cnpjCorrespondente" || elem.id == "nomeCorrespondente"){
          if(document.querySelector("#corresp_sim").checked){
            infos["correspondente"] = true
            infos[elem.id] = elem.value
          }
          else {
            infos["correspondente"] = false
            infos[elem.id] = ""
          }
        }else{
          infos[elem.id] = elem.value
        }
        
        if(elem.id == "taxa"){
          infos[elem.id] = parseFloat(elem.value.replace(/[^0-9,]+/gm,"").replace(",","."))
        }
        if(elem.id == "valorFinanciamento"){
          infos[elem.id] = parseFloat((document.querySelector("#valorFinanciamento").value).replace(/[^0-9,]+/gm,"").replace(",","."))
        }
      })

      document.querySelectorAll("[type='checkbox']").forEach((elem) => {
        infos[elem.id] = elem.checked
      })

      document.querySelectorAll(".form-check-input").forEach( elem => {
        if(elem.name == "tipoMutuario"){
          if(elem.checked){ infos[elem.name] = elem.value}
        }
        if(elem.name == "tipoVendedor"){
          if(elem.checked){ infos[elem.name] = elem.value}
        }
      })
      elem = document.querySelector("#tipodeamortizacao")
      infos[elem.id] = elem.value

      alert("Informações")
      console.log("infos:", infos)
    })
  }
