document.addEventListener('DOMContentLoaded', (event) => {

  function handleDragStart(e) {
    this.style.opacity = '0.1';

    dragSrcEl = this;

    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.id);
  }

  function handleDragEnd(e) {
    this.style.opacity = '1';

    items.forEach(function (item) {
      item.classList.remove('over');
    });
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    return false;
  }

  function handleDragEnter(e) {
    this.classList.add('over');
  }

  function handleDragLeave(e) {
    this.classList.remove('over');
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();
   
    if (dragSrcEl !== this) {

      if (!checkRules(dragSrcEl, this)) return false;

      movecard(dragSrcEl, this, e);
      makelastdraggable();

    }
  
    return false;
  }

 function embaralhar () {

    var srCardCd;
    var tgCardCd;
    var randPos;
    let cards = document.querySelectorAll('.carta');
    cards.forEach(function(card) {
      randPos = Math.floor(Math.random() * 100) % 51;
      srCardCd = card.id.slice(4,7); // Extrai código da carta que original
      tgCardCd = cards[randPos].id.slice(4,7); // Extrai o código da carta que será trocada 
      card.id = card.id.replace(srCardCd, tgCardCd);
      cards[randPos].id = cards[randPos].id.replace(tgCardCd, srCardCd);

    });
  }

  function distribuir () {
    var i=0;
    let cards = document.querySelectorAll('.carta');
    cards.forEach(function(card) {
      card.style.background = "url('./img/" + card.id.slice(4, 7) + ".png')";
      card.style.visibility = "visible";
      card.style.position = "relative";
      card.style.top = (i == 0 || (card.id.slice(1,4) != cards[i-1].id.slice(1,4))) ? '0px' : '50px';
      i=i+1;
    });
    makelastdraggable();
  }
    
  function makelastdraggable (idcard) {
    var i=0;
    if (idcard != null) {
      idcard.draggable = false;
      idcard.removeEventListener('dragstart', handleDragStart);
      idcard.removeEventListener('dragenter', handleDragEnter);
      idcard.removeEventListener('dragleave', handleDragLeave);
      idcard.removeEventListener('dragend', handleDragEnd);
      return;
    }
    let cards = document.querySelectorAll('.carta');
    cards.forEach(function(card) {
      i=i+1;
      if (i == 52 || (card.id.slice(1,4) != cards[i].id.slice(1,4))) { // Se for a última carta da pilha, torna arrastável
        card.draggable = true;
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragenter', handleDragEnter);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('drop', handleDrop);
      }
    });
   }

  function checkRules (IdSource, IdTarget) {
    
    var tgCode = IdTarget.id.slice(0, 1);
    var tgstackNr = Number(IdTarget.id.slice(2,4));
    var tgstackCd = IdTarget.id.slice(1,2);
    var srNipe = IdSource.id.slice(4, 5);
    var srSeq  = Number(IdSource.id.slice(5, 7));
    var tgNipe = IdTarget.id.slice(4, 5);
    var tgSeq = Number(IdTarget.id.slice(5, 7));

    switch (tgCode) {
      case "f":
        return true;
      case "r":
        if ((tgstackNr == 13 && srNipe !== "c") || 
            (tgstackNr == 14 && srNipe !== "d") ||
            (tgstackNr == 15 && srNipe !== "h") ||
            (tgstackNr == 16 && srNipe !== "s")) return false;     // Se não correspoder ao nipe da célula 
        if (srSeq == 1) return true;  // Se for a carta Ás
        break;
      case 'c':
        if (tgstackCd == 'r' && tgNipe == srNipe && srSeq == tgSeq + 1) return true; // Se a carta na pilha de saida for próxima sequencia 
        if (tgstackCd == 'f') return false; // Se pilha freecell ja está ocupada;
        if ((tgNipe == "s" || tgNipe == "c") && (srNipe == "s" || srNipe == "c")) return false; // Verifica se os nipes das pilhas são da mesma cor (preto com preto)
        if ((tgNipe == "d" || tgNipe == "h") && (srNipe == "d" || srNipe == "h")) return false; // Verifica se os nipes das pilhas são da mesma cor (vermelho com vermelho)
        if (tgSeq == srSeq + 1) return true; // Verifica se a sequencia da carta adicionada é uma abaixo da carta da pilha 
        break;
      case 'p':
        if (IdTarget.firstChild.nextElementSibling != null) return false;
        return true;
    }
    return false;
  }

  function movecard(source, target, event) {

    var tgCode = target.id.slice(0,1);
    var tgStack = target.id.slice(1,4);
    var tgStackCd = target.id.slice(1,2);
    var srStack = source.id.slice(1,4)

    // Movimenta a carta na tela
    const dados = event.dataTransfer.getData("text/plain");
    const carta = document.getElementById(dados);
    event.target.appendChild(carta);
    carta.id = carta.id.replace(srStack, tgStack);

    carta.style.top = (tgCode == 'c' && tgStackCd == 'p' ? 50 : 0) + 'px';
    carta.style.left = 0;

    makelastdraggable(target);
  }

  function StartGame () {
       
    embaralhar();
    distribuir();

    items = document.querySelectorAll('.marca,.pilhas');
    items.forEach(function(item) {
      item.addEventListener('dragover', handleDragOver);
      item.addEventListener('drop', handleDrop);
    });

  }

  let dragSrcEl;
  let items;

  StartGame();
    
});