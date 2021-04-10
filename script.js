
// CRIANDO A LISTA, OBS. MAS DESCONVERTENDO DE TEXTO PARA ARRAY, POIS ESTAVASER SALVO NO localStorage COMO TEXTO.
produtos = JSON.parse(localStorage.getItem("produtos"));

// CHAMANDO A FUNÇÃO QUE REESCREVE A LISTA APÓS CARREGAR.
reescreveLista();

function escreveMensagemNoConsole(text, e) {
  console.log("Debug, evento do mouse:", text);
  console.log(e.target);
}

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

  // VALIDA NÚMEORS NEGATIVOS OU IGUAL A 0.
  if (e.target.elements.valorMercadoria.value <= 0) {
    e.target.elements.valorMercadoria.parentElement.querySelector("p").style.display = "block";
    return false;
  }

  // CRIANDO O OBJETO.
  let novoProduto = {
    tipo: e.target.elements.tipoTransacao.value,
    nome: e.target.elements.nomeMercadoria.value,
    valor: e.target.elements.valorMercadoria.value
  }

  // JOGANDO O OBJETO DENTRO DA LISTA.
  produtos.push(novoProduto);

  // CHAMANDO A FUNÇÃO QUE REESCREVE A LISTA AQUI TAMBÉM.
  reescreveLista();

  // SALVANDO NO localStorage, Obs. no localStorage SÓ SALVA TEXTOS ENTÃO USAMOS O JSON.stringify PARA CONVERTER TUDO PARA TEXTO.
  localStorage.setItem("produtos", JSON.stringify(produtos));

  console.log(produtos);

  return false;
}

// BUSCA O ID FORM NO INDEX E ASSOCIA O EVENTO CHAMANDO A FUNÇÃO TRATA.
document.getElementById("meuForm").addEventListener('submit', trataFormulario);

// CÓDIGO QUE INSERI OS VALORES.
function reescreveLista() {
  // O CÓDIGO ABAIXO LIMPA A LISTA ANTES DE INSERIR OS VALORES. 
  document.querySelector(".table-transaction-statement tbody").innerHTML = "";

  // ESSE CÓDIGO SERÁ EXECUTADO PARA CADA ELEMENTO QUE ESTIVER NA LISTA, ELE CHECA SE É UMA COMPRA OU VENDA.
  for (let i = 0; i < produtos.length; i++) {
    var tipoTransacao = "-";

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
  }  
}