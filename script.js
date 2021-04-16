
/*
Devemos destransformar de texto que foi o que fizemos com o “JSON.stringfi” para salvar no localStorage, para array novamente, e para fazer isso usamos o “JSON.parse”.
*/
var produtos = JSON.parse(localStorage.getItem("produtos"));

// Se produtos for igual a nulo é criada uma lista vazia.
if (produtos == null) {
  produtos = [];
}

// Chamando a função que reescreve a lista após carregar.
reescreveLista();

// --------------------------------------------------------
// Valida os campos do “form”.
function trataFormulario(e) {
  e.preventDefault();
  console.log(e.target.elements);

  // Valida os campos em branco.
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

  // Criando o objeto “novoProduto” que associaremos aos campos do nosso “form” usando o evento "e".
  let novoProduto = {
    tipo: e.target.elements.tipoTransacao.value,
    nome: e.target.elements.nomeMercadoria.value,
    valor: e.target.elements.valorMercadoria.value
  }

  // VALIDA NÚMEROS NEGATIVOS E IGUAL A "0", NÃO FOI PRECISO USAR ESSA VALIDAÇÃO USEI O min="0.01" step="0.01" QUE JÁ FAZ ISSO. 
  if (e.target.elements.valorMercadoria.value <= 0) {
    alert("Entre com um valor de mercadoria válido! exemplo: 0,01")
    return false;
  }

  // JOGANDO O OBJETO DENTRO DA LISTA.
  produtos.push(novoProduto);

  // CHAMANDO A FUNÇÃO QUE REESCREVE A LISTA AQUI TAMBÉM.
  reescreveLista();

  /*
  SALVANDO NO "localStorage", OBS. NELE SÓ SALVA TEXTO OU STRING, ELE NÃO SALVA OBJETOS, ENTÃO USAMOS O "JSON.stringify" PARA CONVERTER TUDO PARA TEXTO.
  */
  localStorage.setItem("produtos", JSON.stringify(produtos));

  console.log(produtos);

  // Limpando o rodos os campos do form buscando a referência lá no “index”.
  document.querySelector("form").reset();

  return false;
}

// --------------------------------------------------------
// Função que faz a soma do extrato.
function somaExtrato() {
  // Variável que guarda a soma total do extrato.
  let total = 0;
  
  for (let index = 0; index < produtos.length; index++) {    
    /*
    Somando todos os valores, Obs. o “replace” faz a troca da “,” pelo “.” porque a função “parseFloat” não funciona para vírgula, aqui também usamos regex, a “\” é para escapar, nesse exemplo iremos substituir o “.” por nada, Obs. estou atribuindo essa linha em uma variável para não ter que ficar sempre digitando essa linha.
    */
    let valorQueSeraSomado = parseFloat(produtos[index].valor.replace(/\./g, "").replace(/\,/g, "."));
    
    console.log(valorQueSeraSomado);

    /*
    Fazer a checagem do sinal pois pois ao somar tudo quando o sinal for “-” deverá subtrair etc. e uma Obs. a forma de descobrir se um número é positivo ou negativo é só multiplicá-lo por “-1”, é  o que fazemos a seguir.
    */
    if (produtos[index].tipo != "1") {
      valorQueSeraSomado = valorQueSeraSomado * -1;
    }

    total = total + valorQueSeraSomado;
  }

  return total;
}

// --------------------------------------------------------
/* 
Função que remove a linha ao clicar nela, Obs. por criarmos as linhas dinamicamente, estamos referenciando a nossa “tbody/ tr” aqui mesmo no JS, está no fim da linha.
*/
function removeLinha(e, index) {
  // console.log(e);
  // console.log(index);
  // O que a função “splice” faz, ela remove elementos de um array e inseri um novo elemento no seu lugar se necessário.
  produtos.splice(index, 1);
  // Salvando a alteração no localStorage, Obs. lembrando que antes fazemos a transformação em texto com o "JSON.stringify".
  localStorage.setItem("produtos", JSON.stringify(produtos));
  // Após o uso da função “splice” chamamos a função reescreveLista.
  reescreveLista();
}

// BUSCA O ID FORM NO INDEX E ASSOCIA O EVENTO CHAMANDO A FUNÇÃO TRATA.
document.getElementById("meuForm").addEventListener('submit', trataFormulario);


// --------------------------------------------------------
// FAZ O MENU ABRIR E FECHA ELE E REFERENCIADO NOS BOTÕES QUE ESTÁ NO NAV DO  INDEX.
function trocarMenu() {  
  /* 
  O "indexOf" BUSCAR EM UM ARRAY QUAL A POSIÇÃO DE UM DETERMINADO ELEMENTO, SE ELE RETORNAR -1 SIGUINIFICA QUE NÃO ACHOU NADA, OU SEJA, O MENU ESTÁ FECHADO. OBS. O "indexOf" SÓ FUNCIONA EM ARRAY E STRING, UMA OUTRA COISA, NÓS USAMOS O "document.querySelector(".navbar-menu").classList" COMO SE FOSSE UMA FUNÇÃO OU SEJÁ PODEMOS MELHORAR NOSSO CÓDIGO ATRIBUINDO A UMA VARIÁVEL DE NOME "menu" TORNANDO NOSSO CÓDIGO MAIS LEGÍVEL E MENOR.
  */
  var menu = document.querySelector(".navbar-menu").classList;

  if ([...menu].indexOf("opened") == -1) {
    menu.add("opened");
  } else {
    menu.remove("opened");
  }
}

// --------------------------------------------------------
// Aplicando a máscara.
function aplicaMascara(e) {
  // Para não mostrar os números que não estão na lista dentro do "if" uso a linha de baixo.
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
// CÓDIGO QUE INSERI OS VALORES, ESSA FUNÇÃO LIMPA OU APAGA TODA A LISTA ANTES DE INSERIR OS VALORES.
function reescreveLista() {
  document.querySelector(".table-transaction-statement tbody").innerHTML = "";
  /*
  ESSE CÓDIGO SERÁ EXECUTADO PARA CADA ELEMENTO QUE ESTIVER NA LISTA, ELE CHECA SE É UMA COMPRA OU VENDA. OBS. AQUI GERA UM BUG SE LIMPARMOS O "localStorage" POIS ACHO QUE COMO "produtos" ESTÁ VAZIO APÓS LIMPAR ELE RETORNA UM ERRO POR ISSO, POIS O
  "produtos" NÃO TEM UM TOMANHO.
  */
  for (let i = 0; i < produtos.length; i++) {
    let tipoTransacao = "-";

    if (produtos[i].tipo == "1") {
      tipoTransacao = "+";
    }

    /* 
    Por estamos adicionando as linhas dinamicamente por aqui, minha chamada da função de remover a linha será feita aqui mesmo.
    */
    document.querySelector(".table-transaction-statement tbody").innerHTML += `      
      <tr onclick="removeLinha(event, ${i})">
        <td class="text-right">` + tipoTransacao + `</td>
        <td class="">` + produtos[i].nome + `</td>
        <td class="text-right">` + produtos[i].valor + `</td>
      </tr>
    `
  }

  // Se o extrato estiver vazio aparecerá uma mensagem nele, Obs. estamos colocando dinamicamente.
  if (produtos.length == 0) {
    document.querySelector(".table-transaction-statement tbody").innerHTML += `
      <tr class="text-center">
        <td colspan="3" class="text-center"> Por favor, adicione uma nova transação! </td>
      </tr>
    `
  }
  
  /*
  Chamando a função que faz a soma total do extra e já atribuindo de forma dinâmica via “id” que está lá no meu “tfoot” do index, mostrando duas casa decimal.
  */
  total = somaExtrato();
  lucroOuPrejuizo = "[ LUCRO ]";
  // checando se o número é positivo ou negativo.
  if (total < 0) {
    lucroOuPrejuizo = "[ PREJUÍZO ]";
  }
  // chega se o valor é igual a zero.
  if (total == 0) {
    lucroOuPrejuizo = "";
  }

  
  totalEscrito = ("R$ " + total.toFixed(2));  
  totalEscrito =  totalEscrito.replace("-", "");

  document.getElementById("valorTotal").innerHTML = totalEscrito;
  document.getElementById("lucroOuPrejuizo").innerHTML = lucroOuPrejuizo;
}

// 























/*
Obs. não conseguir aplicar a lógica do milhar no total para mostrar na tela, ficou dando um erro de referência na variável “valueFinalString” segui a aula assim mesmo, vídeo de explicação 3 JS em 1:20 Obs. tentei também com o toLocaleString também não deu certo (tentar depois o Fernando atribui um valor vazio no valueFinalString).
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


/*
Máscara do Jefferson com regex
function mascara_valor() {
  var elemento = document.getElementById('id-valor');
  var valor = elemento.value;

  valor = valor.replace(/\D/g, '')
  valor = valor.replace(/(\d{1})(\d{1,2})$/, "$1,$2")
  valor = valor.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')
  valor = valor.replace(/^(\d)/g, "R$ $1")
  elemento.value = valor;
}
*/
