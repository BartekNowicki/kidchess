import { TheDOM, DATA } from './TheDOM.js';
import { loaderDimentions } from './index.js';
import { Cell } from './Cell.js';
import { Piece } from './Piece.js';

class Board extends TheDOM {    
    constructor() {
    super(DATA.BOARD_SELECTOR);
    this.boardSize = null;
    this.cells = [];
    this.pieces = [];    
    this.pieceMovementSpeed = 1000;
    this.busyDoingStuff = false;
    }

    generateCells() {
        this.cellSize = Math.floor(this.boardSize / 8);
        console.log(this.boardSize, this.cellSize);
            for (let row = 0; row < 8; row++) {
                this.cells[row] = [];                
                for (let col = 0; col < 8; col++) {
                    const newCell = new Cell(row, col, this.cellSize);
                    // console.log(newCell.element);
                    this.cells[row].push(newCell);
                    this.element.appendChild(newCell.element);                    
                }
            }
            this.cells.flat().forEach(cell => cell.takeMeasurements());
            // console.log('ILOŚĆ WYGENEROWANYCH KOMÓREK: ', this.cells.flat().length); 
    }

    insertPiece(pieceName, parentCell, colorSelection = "none", smaller = false) {
        if (colorSelection === "none") {
          throw new Error(`ERROR: color piece color not set`);
        }
        this.pieces.push(new Piece(pieceName, parentCell, colorSelection, smaller));
        // console.log('INSERTING: ', piece, parentCell, colorSelection);
        // console.log('PIECES PRESENT: ', this.pieces);
      }	
  
      setPieces() {
        //first = white at the bottom of he board       

        //START TEST PIECES FOR CHECKING MOVEMENT OPTIONS
        //  this.insertPiece('king', this.cells[4][3], "first", false);
        //  this.insertPiece('king', this.cells[4][4], "second", false);
         //END TEST PIECES FOR CHECKING MOVEMENT OPTIONS

            this.insertPiece('rook', this.cells[7][0], "first", false);
            this.insertPiece('rook', this.cells[7][7], "first", false);
            this.insertPiece('rook', this.cells[0][0], "second", false);
            this.insertPiece('rook', this.cells[0][7], "second", false);

            this.insertPiece('knight', this.cells[7][1], "first", true);
            this.insertPiece('knight', this.cells[7][6], "first", true);
            this.insertPiece('knight', this.cells[0][1], "second", true);
            this.insertPiece('knight', this.cells[0][6], "second", true);

            this.insertPiece('bishop', this.cells[7][2], "first", false);
            this.insertPiece('bishop', this.cells[7][5], "first", false);
            this.insertPiece('bishop', this.cells[0][2], "second", false);
            this.insertPiece('bishop', this.cells[0][5], "second", false); 

            this.insertPiece('king', this.cells[7][3], "first", false);
            this.insertPiece('king', this.cells[0][3], "second", false);

            this.insertPiece('queen', this.cells[7][4], "first", false);
            this.insertPiece('queen', this.cells[0][4], "second", false);

            for (let i = 0; i <= 7; i++ ) {
              this.insertPiece('pawn', this.cells[6][i], "first", false);
              this.insertPiece('pawn', this.cells[1][i], "second", false);
            }
      }

    initializeBoard(gameNumber = 1) {
        console.log('SETTING UP THE BOARD FOR GAME NUMBER: ', gameNumber);
        if (gameNumber === 1) {
          this.toggleVisibility(this.element, 'visible');
          this.pieceMovementEase = "ease-out";
          document.documentElement.style.setProperty("--pieceColor1", "rgba(255,69,0,0.6)");
          document.documentElement.style.setProperty("--pieceColor2", "rgba(173,255,47,0.5)");
          document.documentElement.style.setProperty("--pieceMovementSpeed", `${this.pieceMovementSpeed / 1000}s`);
          document.documentElement.style.setProperty("--pieceMovementEase", `${this.pieceMovementEase}`);
          
          // console.log('initializing a new board instance');
          const { width, height } = loaderDimentions;
          this.boardSize = Math.min(width, height);        
          this.element.style.width = this.boardSize + "px";
          this.element.style.height = this.boardSize + "px";
          // console.log(this.size);
          // console.log(this.element);
          this.generateCells();
        } else {
          this.cells.flat().forEach(cell => cell.resetCellToEmpty());
          this.busyDoingStuff = false;
          
        }
        
        this.setPieces();
        //ANY PIECE CAN APPLY THIS METHOD
        this.pieces[0].markSideToMove();
    }
}

export const board = new Board();

export const busyDoingStuff = board.busyDoingStuff;

export const mainBoardElement = board.element;



