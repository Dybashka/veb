function initBoard() {
    let board = document.getElementById('board');
    for (let i = 0; i < 9; i++)
    {
        let boardCell = document.createElement('div');
        boardCell.classList.add('cell');
        board.append(boardCell);
    }
    showMessage('', 'none');
    return board;
}

function checkAvailableSteps() {
    let cells = document.querySelectorAll('.cell');
    for (let i = 0; i < cells.length; i++)
    {
        if (cells[i].innerHTML == '') return true;
    }
    return false;
}

function checkWinner() {
    let cells = document.querySelectorAll('.cell');
    let row, column, diag, diag1;
    for(let i = 0; i < 3 ; i++)
    {
        diag1 = true;
        row = (cells[i * 3 + 0].innerHTML != '');
        column = (cells[i].innerHTML != '');
        diag = (cells[0].innerHTML != '');
        diag1 = (cells[3 - 1].innerHTML != '')
        for (let j = 0; j < 3 - 1; j++)
        {
            row = row && (cells[i * 3 + j].innerHTML == cells[i * 3 + j + 1].innerHTML);
            column = column && (cells[j * 3 + i].innerHTML == cells[(j + 1) * 3 + i].innerHTML);
            diag = diag && (cells[j * 3 + j].innerHTML == cells[(j + 1) * 3 + j + 1].innerHTML);
            diag1 = diag1 && (cells[j * 3 + 3 - 1 - j].innerHTML == cells[(j + 1) * 3 + 3 - 1 - (j + 1)].innerHTML);
        }
        let winner = (row && cells[i * 3 + 0].innerHTML) || (column && cells[i].innerHTML) || (diag && cells[0].innerHTML) || (diag1 && cells[3 - 1].innerHTML);
        if (winner) return winner;
    }
    return false;
}

function clickHandler(event) {
    if (event.target.className == 'cell')
    {
        if(gameOver) 
        {
            showMessage('Игра окончена. Начните новую игру.', 'err');
            return;
        }
        if (event.target.innerHTML !='')
        {
            showMessage('Эта клетка уже занята!', 'err');
        }
        else
        {
            event.target.innerHTML = turn == 0 ? 'x' : '0';
            turn = (turn + 1) % 2;
        }
        let winner = checkWinner();
        if (winner || !checkAvailableSteps()){
            gameOver = 1;
            showMessage(winner ? `${winner} одержал победу!` : 'Ничья!', 'success');
        }
    }
}

function newGame() {
    let cells = document.querySelectorAll('.cell');
    showMessage('', 'none');
    for (let i = 0; i < cells.length; i++)
    {
       cells[i].innerHTML = '';
    }
    turn = 0;
    gameOver = 0;
}

function showMessage(msg, type) {
    let messageBox = document.getElementById("messages");
    let message = document.createElement('div');
    message.classList.add('msg');
    if (type != "none") message.classList.add(type);
    message.innerHTML = "<p>" + msg + "</p>";
    messageBox.innerHTML = '';
    messageBox.append(message);
}

let turn = 0;
let gameOver = 0;

window.onload = function () {
    let board = initBoard();
    board.onclick = clickHandler;
    document.querySelector('.new-game-btn').onclick = newGame;
}