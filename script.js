
// Obs. essa parte está comentada pois agora os dados estão vindo para exibição lá do “airtable”, e antes era do “localStorage”
// --------------------------------------------------------
// /* Devemos destransformar de texto que foi o que fizemos com o “JSON.stringfi” para salvar no localStorage, para array novamente, e para fazer isso usamos o “JSON.parse” */
// var produtos = JSON.parse(localStorage.getItem("produtos"));

// // Se produtos for igual a nulo é criada uma lista vazia
// if (produtos == null) {
//   produtos = [];
// }

// // Chamando a função que reescreve a lista após carregar
// reescreveLista();


// --------------------------------------------------------
// Chamando a função que busca os dados lá do “airtable” e mostra na tela
produtos = [];
getTable();

// --------------------------------------------------------
// Valida os campos do “form”
function trataFormulario(e) {
  e.preventDefault();
  console.log(e.target.elements);

  // Valida os campos em branco
  if (e.target.elements.tipoTransacao.value == "") {
    e.target.elements.tipoTransacao.parentElement.querySelector("em").style.display = "block";
    return false;
  }

  if (e.target.elements.nomeMercadoria.value == "") {
    e.target.elements.nomeMercadoria.parentElement.querySelector("em").style.display = "block";
    return false;
  }

  if (e.target.elements.valorMercadoria.value == "") {
    e.target.elements.valorMercadoria.parentElement.querySelector("em").style.display = "block";
    return false;
  }

  // Valida números negativos e igual a "0", não foi preciso usar essa validação usei o min="0.01" step="0.01" que já faz isso
  if (e.target.elements.valorMercadoria.value <= 0) {
    alert("Por favor, entre com um valor de mercadoria válido! exemplo: 0,01");
    return false;
  }

  // Criando o objeto “novoProduto” que associaremos aos campos do nosso “form” usando o evento "e"
  let novoProduto = {
    tipo: e.target.elements.tipoTransacao.value,
    nome: e.target.elements.nomeMercadoria.value,
    valor: e.target.elements.valorMercadoria.value
  }

  // Jogando o objeto dentro da lista
  produtos.push(novoProduto);

  // Chamando a função que “reescreve” a lista
  reescreveLista();

  /* Salvando no "localStorage", Obs. nele só salva texto ou string, ele não salva objetos, então usamos o "JSON.stringify" para converter tudo para texto */
  localStorage.setItem("produtos", JSON.stringify(produtos));

  console.log(produtos);

  // Limpando os campos do "form" buscando a referência lá no “index”
  document.querySelector("form").reset();

  return false;
}

// --------------------------------------------------------
// Limpa o extrato
function limpaDados(index) {
  produtos.splice(index)
  reescreveLista();  
}

// --------------------------------------------------------
// Soma do extrato
function somaExtrato() {
  // Variável que guarda a soma total do extrato
  let total = 0;
  
  for (let index = 0; index < produtos.length; index++) {    
    /* Somando todos os valores, Obs. o “replace” faz a troca da “,” pelo “.” porque a função “parseFloat” não funciona para vírgula, aqui também usamos regex, a “\” é para escapar, nesse exemplo iremos substituir o “.” por nada, Obs. estou atribuindo essa linha em uma variável para não ter que ficar sempre digitando essa linha */
    let valorQueSeraSomado = parseFloat(produtos[index].valor.replace(/\./g, "").replace(/\,/g, "."));
    
    console.log(valorQueSeraSomado);

    /* Fazer a checagem do sinal pois pois ao somar tudo quando o sinal for “-” deverá subtrair etc. e uma Obs. a forma de descobrir se um número é positivo ou negativo é só multiplicá-lo por “-1”, é  o que fazemos a seguir */
    if (produtos[index].tipo != "2") {
      valorQueSeraSomado = valorQueSeraSomado * -1;
    }

    total = total + valorQueSeraSomado;
  }

  return total;
}

// --------------------------------------------------------
/* Função que remove a linha ao clicar nela, Obs. por criarmos as linhas dinamicamente, estamos referenciando a nossa “tbody/ tr” aqui mesmo no JS, está no fim da linha */
function removeLinha(e, index) {
  // console.log(e);
  // console.log(index);
  // O que a função “splice” faz, ela remove elementos de um array e inseri um novo elemento no seu lugar se necessário
  produtos.splice(index, 1);
  // Salvando a alteração no localStorage, Obs. lembrando que antes fazemos a transformação em texto com o "JSON.stringify"
  localStorage.setItem("produtos", JSON.stringify(produtos));
  // Após o uso da função “splice” chamamos a função reescreveLista
  reescreveLista();
}

// Busca o “id meuform” lá no “index” e associa o evento submit chamando a função “trataFormulario”
document.getElementById("meuForm").addEventListener('submit', trataFormulario);


// --------------------------------------------------------
// Faz o menu abrir e fechar ele é referenciado nos botões que estão na “nav” do  index.
/* O "indexOf" buscar em um array qual a posição de um determinado elemento, se ele retornar -1 significa que não achou nada, ou seja, o menu está fechado, Obs. o "indexOf" só funciona em array e string, uma outra coisa, nós usamos o "document.querySelector(".navbar-menu").classList" como se fosse uma função ,ou seja, podemos melhorar nosso código atribuindo a uma variável de nome "menu" tornando nosso código mais legível e menor */
function trocarMenu() {
  var menu = document.querySelector(".navbar-menu").classList;

  if ([...menu].indexOf("opened") == -1) {
    menu.add("opened");
  } else {
    menu.remove("opened");
  }
}

// --------------------------------------------------------
// Aplicando a máscara
function aplicaMascara(e) {
  // Para não mostrar os números que não estão na lista dentro do "if" uso a linha de baixo
  e.preventDefault();
  if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].indexOf(e.key) == -1) {    
    // console.log("letra");
  
  } else {    
    // console.log("1", e.target.value);
    let value = e.target.value.replace(/^0,/, "").replace(",", "").replace(/\./g, "")  + e.key;

    if (value.length <= 2) {      
      e.target.value = "0," + value;      
      // console.log("2", e.target.value, value.length, value);
    
    } else {      
      // console.log("3", e.target.value, value.length, value, value.slice(0, value.length - 2), value.slice(value.length - 2, value.length));
      e.target.value = value.slice(0, -2) + ',' + value.slice(value.length-2, value.length);      
    }

    lastIndex = -1;
    value = e.target.value.replace(/^0,[0-9]+/, "").replace(/,[0-9]+$/, "").replace(/\./g, "");
    // console.log(value);
    if (value.length >= 4) {
      valueFinal = [];

      for (let i = value.length; i >= 0; i--) {

        if ((value.length-i) % 3 == 0 && value.slice(i - 3, i)) {
          valueFinal.push(value.slice(i - 3, i));
          lastIndex = i;
        }        
      }
      // console.log(valueFinal);
      valueFinalString = valueFinal.reverse().join(".");
      e.target.value = valueFinalString + "," + e.target.value.replace(/^[0-9.]+,/, "");

      if (value.slice(0, lastIndex - 3)) {
        e.target.value = value.slice(0, lastIndex - 3) + '.' + e.target.value;
      }
    }
  }
}

// --------------------------------------------------------
// Código que insere os valores, essa função limpa ou apaga toda a lista antes de inserir os valores
function reescreveLista() {
  document.querySelector(".table-transaction-statement tbody").innerHTML = "";
  /* Esse código será executado para cada elemento que estiver na lista, ele checa se é uma “compra ou venda” */
  for (let i = 0; i < produtos.length; i++) {
    let tipoTransacao = "+";

    if (produtos[i].tipo == "1") {
      tipoTransacao = "-";
    }

    /* Por estamos adicionando as linhas dinamicamente por aqui, minha chamada da função de remover a linha será feita aqui mesmo */
    document.querySelector(".table-transaction-statement tbody").innerHTML += `      
      <tr onclick="removeLinha(event, ${i})">
        <td class="text-right">` + tipoTransacao + `</td>
        <td class="">` + produtos[i].nome + `</td>
        <td class="text-right">` + produtos[i].valor + `</td>
      </tr>
    `
  }

  // Se o extrato estiver vazio aparecerá uma mensagem nele, Obs. estamos colocando dinamicamente
  if (produtos.length == 0) {
    document.querySelector(".table-transaction-statement tbody").innerHTML += `
      <tr class="text-center">
        <td colspan="3" class="text-center">Não há transações, por favor adicione!</td>
      </tr>
    `
  }
  
  /* Chamando a função que faz a soma total do extra e já atribuindo de forma dinâmica via “id” que está lá no meu “tfoot” do index, mostrando duas casa decimal */
  total = somaExtrato();
  lucroOuPrejuizo = "[ LUCRO ]";
  // checando se o número é positivo ou negativo
  if (total < 0) {
    lucroOuPrejuizo = "[ PREJUÍZO ]";
  }
  // chega se o valor é igual a zero
  if (total == 0) {
    lucroOuPrejuizo = "";
  }

  totalEscrito = "R$ " + total.toFixed(2);
  totalEscrito =  totalEscrito.replace("-", "");

  document.getElementById("valorTotal").innerHTML = totalEscrito;
  document.getElementById("lucroOuPrejuizo").innerHTML = lucroOuPrejuizo;
}

// --------------------------------------------------------
/* Salvar no servidor do airtable, Obs. não precisamos passar parâmetros nessa função pois a variável produtos está global, e a variável aluno também */
var aluno = "8800";
function salvaDados() {  
  // Criando a requisição
  fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
    headers: {
      Authorization: "Bearer key2CwkHb0CKumjuM"
    } 
  })
  .then(response => response.json())
  .then(responseJson => {
    /* A função "filter" ela é aplicada em tipo objeto e nos retorna um valor lógico, ela faz um filtro no array se retorna “true” mantém, se “false” sai fora do array, é feito uma checagem para saber se o "aluno" é igual aos cadastrados lá na API, ou seja, testa se ele existe */
    existe = responseJson.records.filter((record) => {
      if (aluno == record.fields.Aluno) {
        return true;
      } 

      return false;      
    })

    // Esse aluno não está na tabela do "airtable", ele pode ser cadastrado, chama a função que insereDados
    if (existe.length == 0) {
      insereDados();
    } else {
      alteraDados(existe[0].id);
    }
  })
}

// --------------------------------------------------------
// Insere os dados mandando o aluno e o “json” array
function insereDados() {
  var json = JSON.stringify(produtos);
  var body = JSON.stringify({  
    "records": [
      {
        "fields": {
          "Aluno": aluno,
          "Json": json
        }
      }
    ]
  });  
  fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
    method: "POST",
    headers: {
      Authorization: "Bearer key2CwkHb0CKumjuM",
      "Content-Type" : "application/json"
    },
    body:body
  })
}

// --------------------------------------------------------
/* Essa função é semelhante ao “insereDados”, o que muda é que apenas devemos passar um “id”, e ele não será um “post” será um “patch” que irá fazer um update, ou seja, vai alterar os dados */
function alteraDados(id) {
  var json = JSON.stringify(produtos);
  var body = JSON.stringify({  
    "records": [
      {
        "id": id,
        "fields": {
          "Aluno": aluno,
          "Json": json
        }
      }
    ]
  });  
  fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
    method: "PATCH",
    headers: {
      Authorization: "Bearer key2CwkHb0CKumjuM",
      "Content-Type" : "application/json"
    },
    body:body
  })  
}

// --------------------------------------------------------
/* função que irá buscar os dados e exibir na tela do extrato lá do “airtable”, ou seja, a aplicação deixará de fazer isso do “localStorage” */
function getTable() {
  fetch("https://api.airtable.com/v0/appRNtYLglpPhv2QD/Historico", {
    headers: {
      Authorization: "Bearer key2CwkHb0CKumjuM"
    } 
  })
  .then(response => response.json())
  .then(responseJson => {
    /* A função "filter" ela é aplicada em tipo objeto e nos retorna um valor lógico, ela faz um filtro no array se retorna “true” mantém, se “false” sai fora do array, é feito uma checagem para saber se o "aluno" é igual aos cadastrados lá na API, ou seja, testa se ele existe */
    existe = responseJson.records.filter((record) => {
      if (aluno == record.fields.Aluno) {
        return true;
      } 

      return false;      
    })

    /* Se esse aluno está lá no "airtable", ele será exibido, Obs. se não irá retornar um array vazio, Obs. é importante passar a posição “0” do array no "else" */
    if (existe.length == 0) {
      produtos = [];
    } else {
      produtos = JSON.parse(existe[0].fields.Json);
    }

    reescreveLista();
  })
}





































/*
Obs. não conseguir aplicar a lógica do milhar no total para mostrar na tela, ficou dando um erro de referência na variável “valueFinalString” segui a aula assim mesmo, vídeo de explicação 3 JS em 1:20 Obs. tentei também com o toLocaleString também não deu certo (tentar depois o Fernando atribui um valor vazio no valueFinalString)
*/
// Transformando a variável “totalEscrito” em array, o split é para separar por “.”
// totalEscritoArray = totalEscrito.split(".");

// lastIndex = 0;
// valueFinalString = "";

// if (totalEscritoArray[0].length >= 4) {
//   valueFinal = [];

//   for (let i = totalEscritoArray[0].length; i >= 0; i--) {
//     if ((totalEscritoArray[0].length-i) % 3 == 0 && totalEscritoArray[0].slice(i - 3, i)) {
//       valueFinal.push(totalEscritoArray[0].slice(i - 3, i));
//       lastIndex = i;
//     }        
//   }
  
//   valueFinalString = valueFinal.reverse().join(".");
// }

// if (totalEscritoArray[0].slice(0,lastIndex-3)) {
//   valueFinalString = totalEscritoArray[0].slice(0,lastIndex-3) + '.' + valueFinalString;
// }

// totalEscrito = "R$ " + valueFinalString + ',' + totalEscritoArray[1];
