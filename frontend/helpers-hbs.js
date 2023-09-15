
module.exports = {
    
    formatDate: (datetime) => {            
        const dia = ( datetime.getDate().toString().length == 1 ? `0${datetime.getDate()}` : datetime.getDate() );
        const mes = ( datetime.getMonth().toString().length == 1 ? `0${datetime.getMonth()}` : datetime.getMonth() );;
        const ano = datetime.getFullYear();


        const formatDate = `${dia}/${mes}/${ano}`

        return formatDate
    },

    checkStatusDps: (status, filtro) => {
        
        let retorno;
        
        switch(filtro){
            case "analise":
                if(status == "analise") retorno = "checked"
                break
            case "sim":
                if(status == "sim") retorno = "checked"
                break
            case "nao":
                if(status == "nao") retorno = "checked"
                break
        }

        return retorno
    },

    checkCondicaoDps: (condicao, filtro) => {
        
        let retorno;
        
        switch(filtro){
            case "sim":
                if(condicao == true) retorno = "checked"
                break
            case "nao":
                if(condicao == false) retorno = "checked"
                break
        }

        return retorno
    }
    
}
