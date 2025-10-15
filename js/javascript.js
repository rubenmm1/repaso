let tablero= document.getElementById('board')
let btReiniciar=document.getElementById('restartBtn')
let mensaje=document.getElementById('message');

const size = 10;
const minas = 10;

let celdas=[]
let posicionMinas=[]


function crearTablero(){
    tablero.innerHTML="";
    celdas=[];
    posicionMinas=[];

    for (let i = 0; i < size*size; i++) {
        const celda = document.createElement("div");
        celda.classList.add("cell");
        celda.dataset.index = i;

        celda.addEventListener("click", () => revelarCelda(i));
        celda.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            colocarBandera(i);
        });

        tablero.appendChild(celda);
        celdas.push({
            element: celda,
            revealed: false,
            isMine: false,
            flagged: false,
            adjacentMines: 0
        })
    }

    colocarBombas();
    calcularProximidades();

}


function colocarBombas(){
    while(posicionMinas.length<minas){
        const index = Math.floor(Math.random() * size * size);
        if(!celdas[index].isMine){
            celdas[index].isMine = true;
            posicionMinas.push(index);
        }
    }
};

function calcularProximidades(){
    for (let i = 0; i < celdas.length; i++) {
        
        if (celdas[i].isMine) continue;
        let contador = 0;
        cogerVecinos(i).forEach(vecino => {
           if(celdas[vecino].isMine){contador++;}
        });
        celdas[i].adjacentMines=contador;
    }
};

function colocarBandera(index) {
  const celda = celdas[index];
  if (celda.revealed) return;

  celda.flagged = !celda.flagged;
  celda.element.classList.toggle("flagged");
  celda.element.textContent = celda.flagged ? "🚩" : "";
}

//FUNCION DEL CHAT

function cogerVecinos(index) {
  const x = index % size;
  const y = Math.floor(index / size);
  const vecinos = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) continue;
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < size && ny >= 0 && ny < size) {
        vecinos.push(ny * size + nx);
      }
    }
  }

  return vecinos;
}



function revelarCelda(i){
    const celda=celdas[i];

    if(celda.revealed || celda.flagged) return;

    celda.revealed = true;
    celda.element.classList.add("revealed");

    if (celda.isMine) {
    celda.element.textContent = "💣";
    gameOver(false);
    return;
  }

  if (celda.adjacentMines > 0) {
    celda.element.textContent = celda.adjacentMines;
  } else {
    cogerVecinos(i).forEach(revelarCelda);
  }

  checkWin();
}


function gameOver(victoria) {
  celdas.forEach((celda, i) => {
    if (celda.isMine) {
      celda.element.textContent = "💣";
      celda.element.classList.add("revealed");
    }
    celda.element.style.pointerEvents = "none";
  });
  message.textContent = victoria ? "¡Ganaste! " : "¡Perdiste! ";
}

function checkWin() {
  const unrevealed = celdas.filter(c => !c.revealed);
  if (unrevealed.length === minas) {
    gameOver(true);
  }
}


crearTablero()



document.getElementById("restartBtn").addEventListener("click", () => {
  message.textContent = "";
  crearTablero();
});