
// CRIANDO A LISTA VAZIA, OBS. DEVEMOS DESCONVERTER DE TEXTO PARA ARRAY, POIS ESTAVA SALVO NO localStorage COMO TEXTO.
var produtos = JSON.parse(localStorage.getItem("produtos"));

if (produtos == null) {
  produtos = [];
}

// CHAMANDO A FUNÇÃO QUE REESCREVE A LISTA APÓS CARREGAR.
reescreveLista();

// FUNÇÃO QUE VALIDA OS CAMPOS DO FORM.
function trataFormulario(e) {
  e.preventDefault();
  console.log(e.target.elements);

  // VALIDA CAMPOS EM BRANCO.
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

  // CRIANDO O OBJETO "novoProduto" QUE ASSOCIAMOS AOS CAMPOS DOSSO FORM USANDO O EVENTO.
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

  return false;
}

// BUSCA O ID FORM NO INDEX E ASSOCIA O EVENTO CHAMANDO A FUNÇÃO TRATA.
document.getElementById("meuForm").addEventListener('submit', trataFormulario);


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
      e.target.value = value.slice(0, -2) + ',' + value.slice(value.length-2, value.length);      
      // console.log("3", e.target.value, value.length, value, value.slice(0, value.length - 2), value.slice(value.length - 2, value.length));
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

// CÓDIGO QUE INSERI OS VALORES, ESSA FUNÇÃO LIMPA OU APAGA TODA A LISTA ANTES DE INSERIR OS VALORES.
function reescreveLista() {
  document.querySelector(".table-transaction-statement tbody").innerHTML = "";

  // VARIÁVEL QUE GUARDA A SOMA TOTAL DO EXTRATO.
  let total = 0;

  /*
  ESSE CÓDIGO SERÁ EXECUTADO PARA CADA ELEMENTO QUE ESTIVER NA LISTA, ELE CHECA SE É UMA COMPRA OU VENDA. OBS. AQUI GERA UM BUG SE LIMPARMOS O "localStorage" POIS ACHO QUE COMO "produtos" ESTÁ VAZIO APÓS LIMPAR ELE RETORNA UM ERRO POR ISSO, POIS O
  "produtos" NÃO TEM UM TOMANHO.
  */
  for (let i = 0; i < produtos.length; i++) {
    let tipoTransacao = "-";

    if (produtos[i].tipo == "1") {
      tipoTransacao = "+";
    }

    document.querySelector(".table-transaction-statement tbody").innerHTML += `
      <tr>
        <td class="text-right">` + tipoTransacao + `</td>
        <td class="">` + produtos[i].nome + `</td>
        <td class="text-right">` + produtos[i].valor + `</td>
      </tr>
    `

    // SOMANDO TODOS OS VALORES, OBS. ".replace" TROCA A VÍRGULA POR PONTO PORQUE O "parseFloat" NÃO FUNCIONA PARA VÍRGULA.
    total += parseFloat((tipoTransacao + produtos[i].valor).replace("," , "."));
  }
  
  // MOSTRANDO A SOMA DOS VALORES COM DUAS CASA DECIMAIS APÓS A VÍRGULA.
  console.log(total.toFixed(2));
}



























  