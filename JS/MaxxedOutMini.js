//back end board to handle game
// noinspection JSIncompatibleTypesComparison

const board = [
    null,   0,      null,   1,      null,   2,      null,   3,
    4,      null,   5,      null,   6,      null,   7,      null,
    null,   8,      null,   9,      null,   10,     null,   11,
    null,   null,   null,   null,   null,   null,   null,   null,
    null,   null,   null,   null,   null,   null,   null,   null,
    12,     null,   13,     null,   14,     null,   15,     null,
    null,   16,     null,   17,     null,   18,     null,   19,
    20,     null,   21,     null,   22,     null,   23,     null]


// returns the current index of a piece
function getLocation(current_piece) {
    return board.indexOf(current_piece);
}

// Referencing the dom to grab information/ Setting Variables
const cells = document.querySelectorAll("td");
let white_piece = document.querySelectorAll("p");
let red_piece = document.querySelectorAll("span");
const WhiteText = document.querySelectorAll(".whitetext"); //is edit the topic colors to who goes
const RedText = document.querySelectorAll(".redtext");
const redscoretext = document.querySelector('#score');
const whitescoretext = document.querySelector('#score2');


let redscore = 0;
let whitescore = 0;
let IsItWhite = false;
let white_Score = 12; //everytime minus add obj or visual or blah blah
let red_Score = 12;
let current_player;

let directions = { //used for our directions to help navigate
    BL: 7,
    BR: 9,
    JBL: 14,
    JBR: 18,
    TR: -7,
    TL: -9,
    JTR: -14,
    JTL: -18
}

//current object values to help check
let selected = {
    pieceId: -1,
    pieceIndex: -1,                             //     If X is current selected
    king: false,                                //  |_JmpTL_|             |_JmpTR_|
    BottomL: false,                             //          |_TL_|___|_TR_|
    BottomR: false,                             //          |____|_X_|____|
    JmpBottomL: false,                          //          |_BL_|___|_BR_|
    JmpBottomR: false,                          //  |_JmpBL_|             |_JmpBR_|
    TopR: false, //TopR
    TopL: false, //TopL
    JmpTopR: false, //JmpTopR
    JmpTopL: false //JmpTopL
}
let AIdirect = [14, 18, -14, -18, 7, 9, -7, -9];

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for(i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}
//Adding listeners to the current teams pieces done each turn
function setEventListeners() {
    if (IsItWhite) {
        if (white_Score === 0){
            return;
        }
        console.log(getRandomInt(1))
        SetCurrentColor();
        getAIselection();
        //JSON OBJECT ATTEMPT
        let possible = [selected.JmpBottomL, selected.JmpBottomR, selected.JmpTopR, selected.JmpTopL, selected.BottomL, selected.BottomR, selected.TopR, selected.TopL]
        var list = getAllIndexes(possible, true)
        console.log(list);
        if(list.indexOf(0) >= 0 | list.indexOf(1) >= 0 | list.indexOf(2) >= 0 | list.indexOf(3) >= 0){
            var checker = -1;
            while(checker < 0){
                checker = list.indexOf(getRandomInt(4));
            }
            makeSelection(AIdirect[list[checker]]);
        }
        else {
            makeSelection(AIdirect[list[getRandomInt(list.length)]]);
        }
        }
        else {
        for (let i = 0; i < red_piece.length; i++) {
            red_piece[i].addEventListener("click", SetCurrentColor);
        }
    }
}

function makeSelection(direction){
    removePreviousChecks(selected)
    document.getElementById(selected.pieceId).remove();//removes element
    cells[selected.pieceIndex].innerHTML = "";
    //white
    if (selected.king) { //sets piece to same colors (king or nah)
        cells[selected.pieceIndex + direction].innerHTML = `<p class="white king" id="${selected.pieceId}"></p>`;
        white_piece = document.querySelectorAll("p");
    }
    else {
        cells[selected.pieceIndex + direction].innerHTML = `<p class="white" id="${selected.pieceId}"></p>`;
        white_piece = document.querySelectorAll("p");
    }

    let indexOfPiece = selected.pieceIndex
    if (direction === 14 || direction === -14 || direction === 18 || direction === -18) { //checks if move was jumping
        updateInfo(indexOfPiece, indexOfPiece + direction, indexOfPiece + direction / 2);
    }
    else {
        updateInfo(indexOfPiece, indexOfPiece + direction);
    }
}

//sets color of the current player and holds onto number of pieces
function SetCurrentColor() {
    if (IsItWhite) {
        current_player = white_piece;
    } else {
        current_player = red_piece;
    }
    resetSelect();
    resetBorders();
}

//for reselecting if mind changes
function resetSelect() {
    removePreviousChecks(selected);
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeAttribute("onclick");
    }
}

//resets border after moves
function resetBorders() {
    for (let i = 0; i < current_player.length; i++) {
        current_player[i].style.border = "1px solid white";
    }
    removeSelection();
    if (IsItWhite == false){
        getSelection();
    }
}

//reset obj values of the selected after move
function removeSelection() {
    selected.pieceId = -1;
    selected.king = false;
    selected.BottomL = false;
    selected.BottomR = false;
    selected.JmpBottomL = false;
    selected.JmpBottomR = false;
    selected.TopR = false;
    selected.TopL = false;
    selected.JmpTopR = false;
    selected.JmpTopL = false;
}

//finds piece
function getSelection() {
    console.log(cells); //check location and algo
    console.log(white_piece);
    console.log(event.target.id);
    selected.pieceId = parseInt(event.target.id);
    selected.pieceIndex = getLocation(selected.pieceId);
    isPieceKing();
    console.log(selected);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getAIselection(){
    console.log("hello")
    do{ //check logic here
        let selection = getRandomInt(11) + getRandomInt(2);
        if(selection == 12){selection = 11;}
        selected.pieceId = selection;
        selected.pieceIndex = getLocation(selected.pieceId);
    }while (selected.pieceIndex < 0);
    isPieceKing();

}

//finds out if king or nah
function isPieceKing() {
    selected.king = document.getElementById(selected.pieceId).classList.contains("king");
    getAvailableSpaces();
}

//gets available 1 place moves
function getAvailableSpaces() {
    if (board[selected.pieceIndex + directions.BL] === null && cells[selected.pieceIndex + directions.BL].classList.contains("empty") !== true) {
        selected.BottomL = true;
    }
    if (board[selected.pieceIndex + directions.BR] === null && cells[selected.pieceIndex + directions.BR].classList.contains("empty") !== true) {
        selected.BottomR = true;
    }
    if (board[selected.pieceIndex + directions.TR] === null && cells[selected.pieceIndex + directions.TR].classList.contains("empty") !== true) {
        selected.TopR = true;
    }
    if (board[selected.pieceIndex + directions.TL] === null && cells[selected.pieceIndex + directions.TL].classList.contains("empty") !== true) {
        selected.TopL = true;
    }
    checkAvailableJumpSpaces();
}

//gets available jump moves
function checkAvailableJumpSpaces() {
    if (IsItWhite) {
        if (board[selected.pieceIndex + directions.JBL] === null && cells[selected.pieceIndex + directions.JBL].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.BL] >= 12) {
            selected.JmpBottomL = true;
        }
        if (board[selected.pieceIndex + directions.JBR] === null && cells[selected.pieceIndex + directions.JBR].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.BR] >= 12) {
            selected.JmpBottomR = true;
        }
        if (board[selected.pieceIndex + directions.JTR] === null && cells[selected.pieceIndex + directions.JTR].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.TR] >= 12) {
            selected.JmpTopR = true;
        }
        if (board[selected.pieceIndex + directions.JTL] === null && cells[selected.pieceIndex + directions.JTL].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.TL] >= 12) {
            selected.JmpTopL = true;
        }
        /*
        * BL: 7,
    BR: 9,
    JBL: 14,
    JBR: 18,
    TR: -7,
    TL: -9,
    JTR: -14,
    JTL: -18*/
    }
    else {
        if (board[selected.pieceIndex + directions.JBL] === null && cells[selected.pieceIndex + directions.JBL].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.BL] < 12 && board[selected.pieceIndex + directions.BL] !== null) {
            selected.JmpBottomL = true;
        }
        if (board[selected.pieceIndex + directions.JBR] === null && cells[selected.pieceIndex + directions.JBR].classList.contains("empty") !== true
            && board[selected.pieceIndex + directions.BR] < 12 && board[selected.pieceIndex + directions.BR] !== null) {
            selected.JmpBottomR = true;
        }
        if (board[selected.pieceIndex + directions.JTR] === null && cells[selected.pieceIndex + directions.JTR].classList.contains("empty") !== true && board[selected.pieceIndex + directions.TR] < 12
            && board[selected.pieceIndex + directions.TR] !== null) {
            selected.JmpTopR = true;
        }
        if (board[selected.pieceIndex + directions.JTL] === null && cells[selected.pieceIndex + directions.JTL].classList.contains("empty") !== true && board[selected.pieceIndex + directions.TL] < 12
            && board[selected.pieceIndex + directions.TL] !== null) {
            selected.JmpTopL = true;
        }
    }
    MovementRestrictions();
}

// restricts movement if the piece is a king
function MovementRestrictions() {
    if (selected.king) { //give no restrictions cuz king
        selectionIdentifier();
    }
    else {
        if (IsItWhite) { //if white cant move up
            selected.TopR = false;
            selected.TopL = false;
            selected.JmpTopR = false;
            selected.JmpTopL = false;
        }
        else { //if red cant move down
            selected.BottomL = false;
            selected.BottomR = false;
            selected.JmpBottomL = false;
            selected.JmpBottomR = false;
        }
        selectionIdentifier();
    }
}

//shows selected piece checks for if a possibly moving piece if not no move
function selectionIdentifier() {
    if (selected.BottomL || selected.BottomR || selected.JmpBottomL || selected.JmpBottomR
        || selected.TopR || selected.TopL || selected.JmpTopR || selected.JmpTopL) {
        document.getElementById(selected.pieceId).style.border = "3px solid green";

        allowMove();
    } else {
        resetSelect();
        if (IsItWhite){ //TODO;
            removeSelection();
            resetSelect();
            getAIselection();
        }
        return;
    }
}

//gives available cells moves and adds guide moves
function allowMove() {
    if (selected.BottomL) {
        cells[selected.pieceIndex + directions.BL].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.BL].setAttribute("onclick", "move(7)");
    }
    if (selected.BottomR) {
        cells[selected.pieceIndex + directions.BR].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.BR].setAttribute("onclick", "move(9)");
    }
    if (selected.JmpBottomL) {
        cells[selected.pieceIndex + directions.JBL].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.JBL].setAttribute("onclick", "move(14)");
    }
    if (selected.JmpBottomR) {
        cells[selected.pieceIndex + directions.JBR].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.JBR].setAttribute("onclick", "move(18)");
    }
    if (selected.TopR) {
        cells[selected.pieceIndex + directions.TR].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.TR].setAttribute("onclick", "move(-7)");
    }
    if (selected.TopL) {
        cells[selected.pieceIndex + directions.TL].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.TL].setAttribute("onclick", "move(-9)");
    }
    if (selected.JmpTopR) {
        cells[selected.pieceIndex + directions.JTR].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.JTR].setAttribute("onclick", "move(-14)");
    }
    if (selected.JmpTopL) {
        cells[selected.pieceIndex + directions.JTL].innerHTML = `<p class="checking" id="${selected.pieceId}"></p>`
        cells[selected.pieceIndex + directions.JTL].setAttribute("onclick", "move(-18)");
    }
}

//removes possible moves guide spaces
function removePreviousChecks(previousSelect){
    if (previousSelect.BottomL) {
        cells[previousSelect.pieceIndex + directions.BL].innerHTML = ""
    }
    if (previousSelect.BottomR) {
        cells[previousSelect.pieceIndex + directions.BR].innerHTML = ""
    }
    if (previousSelect.JmpBottomL) {
        cells[previousSelect.pieceIndex + directions.JBL].innerHTML = ""
    }
    if (previousSelect.JmpBottomR) {
        cells[previousSelect.pieceIndex + directions.JBR].innerHTML = ""
    }
    if (previousSelect.TopR) {
        cells[previousSelect.pieceIndex + directions.TR].innerHTML = ""
    }
    if (previousSelect.TopL) {
        cells[previousSelect.pieceIndex + directions.TL].innerHTML = ""
    }
    if (previousSelect.JmpTopR) {
        cells[previousSelect.pieceIndex + directions.JTR].innerHTML = ""
    }
    if (previousSelect.JmpTopL) {
        cells[previousSelect.pieceIndex + directions.JTL].innerHTML = ""
    }
}

//when click is set the ability to move is added allowing this function to move the pieces
function move(direction) {
    removePreviousChecks(selected)  //removes the guides
    document.getElementById(selected.pieceId).remove();//removes element
    cells[selected.pieceIndex].innerHTML = "";
    if (IsItWhite) { //white
        if (selected.king) { //sets piece to same colors (king or nah)
            cells[selected.pieceIndex + direction].innerHTML = `<p class="white king" id="${selected.pieceId}"></p>`;
            white_piece = document.querySelectorAll("p");
        }
        else {
            cells[selected.pieceIndex + direction].innerHTML = `<p class="white" id="${selected.pieceId}"></p>`;
            white_piece = document.querySelectorAll("p");
        }
    }
    else { //red
        if (selected.king) {
            cells[selected.pieceIndex + direction].innerHTML = `<span class="red king" id="${selected.pieceId}"></span>`;
            red_piece = document.querySelectorAll("span");
        }
        else {
            cells[selected.pieceIndex + direction].innerHTML = `<span class="red" id="${selected.pieceId}"></span>`;
            red_piece = document.querySelectorAll("span");
        }
    }

    let indexOfPiece = selected.pieceIndex
    if (direction === 14 || direction === -14 || direction === 18 || direction === -18) { //checks if move was jumping
        updateInfo(indexOfPiece, indexOfPiece + direction, indexOfPiece + direction / 2);
    }
    else {
        updateInfo(indexOfPiece, indexOfPiece + direction);
    }
}

// Changes the board states data on the back end
function updateInfo(pieceIndex, modifiedIndex, removePiece) {
    board[pieceIndex] = null;
    board[modifiedIndex] = parseInt(selected.pieceId);
    if (IsItWhite && selected.pieceId < 12 && modifiedIndex >= 57) {
        document.getElementById(selected.pieceId).classList.add("king")
    }
    if (IsItWhite === false && selected.pieceId >= 12 && modifiedIndex <= 7) {
        document.getElementById(selected.pieceId).classList.add("king");
    }
    if (removePiece) { // if null nothing to update besides the new place
        board[removePiece] = null;
        if (IsItWhite && selected.pieceId < 12) {
            cells[removePiece].innerHTML = "";
            red_Score--
            redscoretext.innerText = red_Score//variable for SCORE - - - - - - removeSelection - - - - - - - - - - - ! - - - - - - -

        }
        if (IsItWhite === false && selected.pieceId >= 12) {
            cells[removePiece].innerHTML = "";
            white_Score--
            whitescoretext.innerText = white_Score//variable for SCORE - - - - - - - - - - - - - - - - - - ! - - - - - - -

        }
    }
    removeSelection();
    resetSelect();
    removeEventListeners();
}

// removes the 'onClick' event listeners for pieces
function removeEventListeners() {
    if (IsItWhite == false){
        for (let i = 0; i < red_piece.length; i++) {
            red_piece[i].removeEventListener("click", SetCurrentColor);
        }
    }
    Win();
}

// Checks for a win
function Win() {
    if (red_Score === 0) {
        for (let i = 0; i < WhiteText.length; i++) {
            WhiteText[i].style.color = "white";
            RedText[i].style.display = "none";
            WhiteText[i].textContent = "WHITE WINS!";
            console.log("WHITE")
        }
    }
    else if (white_Score === 0) {
        for (let i = 0; i < RedText.length; i++) {
            RedText[i].style.color = "red";
            WhiteText[i].style.display = "none";
            RedText[i].textContent = "RED WINS!";
            console.log("RED")
        }
    }
    changePlayer();
}

// Switches players turn IN COLOR
function changePlayer() {
    if (IsItWhite) {
        IsItWhite = false;
        for (let i = 0; i < WhiteText.length; i++) {
            WhiteText[i].style.color = "lightGrey";
            RedText[i].style.color = "red";
        }
    }
    else {
        IsItWhite = true;
        for (let i = 0; i < RedText.length; i++) {
            RedText[i].style.color = "lightGrey";
            WhiteText[i].style.color = "white";
        }
    }
    setEventListeners();
}

//GAME START
setEventListeners();

function refreshPage() {
    location.reload();
}

//
// const redscore_points = 12;
// const whitescore_points = 12;



// update = num => {
//     redscoretext.innerText = red_Score
// }
//
// update2 = num => {
//     whitescoretext.innerText = white_Score
// }
