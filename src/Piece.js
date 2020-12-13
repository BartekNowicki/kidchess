import { loaderLoadedSvgHTML, allCells, allPieces, pieceMovementSpeed } from './index.js';

export class Piece {
        constructor (pieceName, parentCell, colorSelection, smaller) {
            this.name = pieceName;
            this.parentCell = parentCell;
            this.colorSelection = colorSelection;
            this.smaller = smaller;
            this.element = null;
            this.fromTop = null;
            this.fromLeft = null;
            this.active = false;
            this.moveOptionCells = [];
            this.cellsToAttack = [];
            this.doneCheckingUpword = false;
            this.doneCheckingDownword = false;
            this.doneCheckingLeftword = false;
            this.doneCheckingRightword = false;
            this.doneCheckingDiagonallyupleft = false;
            this.doneCheckingDiagonallyupright = false;
            this.doneCheckingDiagonallydownleft = false;
            this.doneCheckingDiagonallydownright = false;
            this.allCellsFromIndex = allCells;
            this.allPiecesFromIndex = allPieces;
            this.pieceMovementSpeedFromIndex = pieceMovementSpeed;
            this.createThePiece();
            
        }

        findPieceIndex(piece) {
            let index = -1;
            loaderLoadedSvgHTML.forEach(item => {
              if (item.includes(piece)) {
                index = loaderLoadedSvgHTML.indexOf(item);
              }
            });
            return index
        }

        clearMoveOptions() {
            this.allCellsFromIndex.flat().forEach(cell => cell.element.classList.remove("activeMoveOptionCell"));            
            this.moveOptionCells.length = 0; 
        }

        //CHECKS IF THE ROW EXISTS, IF SO IF THE COLUMN EXISTS, IF SO IF THE CELL IS EMPTY
        //IF EMPTY THE CELL IS ADDED TO THE POTENTIAL MOVEMENT LIST AND THE FUNCTION RETURNS TRUE
        checkAndIncludeAsMovementOption(row, col) {
            if (this.allCellsFromIndex[row] && this.allCellsFromIndex[row][col] && this.allCellsFromIndex[row][col].piece === "")  {
                this.moveOptionCells.push(this.allCellsFromIndex[row][col]);
                return true
            }
            return false
        }

        checkPerpendicularMovementOptions(row, col, onlyOneCell = false) {            
            let i = 1;
            this.doneCheckingUpword = false;
            this.doneCheckingDownword = false;
            this.doneCheckingLeftword = false;
            this.doneCheckingRightword = false;
            while(!this.doneCheckingUpword) {  //
                if (this.checkAndIncludeAsMovementOption(row - i, col)) {
                    onlyOneCell ? this.doneCheckingUpword = true : i++;
                } else {
                    this.doneCheckingUpword = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingDownword) {
                if (this.checkAndIncludeAsMovementOption(row + i, col)) {
                    onlyOneCell ? this.doneCheckingDownword = true : i++;
                } else {
                    this.doneCheckingDownword = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingLeftword) {
                if (this.checkAndIncludeAsMovementOption(row, col - i)) {
                    onlyOneCell ? this.doneCheckingLeftword = true : i++;
                } else {
                    this.doneCheckingLeftword = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingRightword) {
                if (this.checkAndIncludeAsMovementOption(row, col + i)) {
                    onlyOneCell ? this.doneCheckingRightword = true : i++;
                } else {
                    this.doneCheckingRightword = true;
                    i = 1;
                }
            }
        }        

        checkDiagonalMovementOptions(row, col, onlyOneCell = false) {
            let i = 1;
            this.doneCheckingDiagonallyupleft = false;
            this.doneCheckingDiagonallyupright = false;
            this.doneCheckingDiagonallydownleft = false;
            this.doneCheckingDiagonallydownright = false;
            while(!this.doneCheckingDiagonallyupleft) {
                if (this.checkAndIncludeAsMovementOption(row - i, col - i)) {
                    onlyOneCell ? this.doneCheckingDiagonallyupleft = true : i++;
                } else {
                    this.doneCheckingDiagonallyupleft = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingDiagonallyupright) {
                if (this.checkAndIncludeAsMovementOption(row - i, col + i)) {
                    onlyOneCell ? this.doneCheckingDiagonallyupright = true : i++;
                } else {
                    this.doneCheckingDiagonallyupright = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingDiagonallydownright) {
                if (this.checkAndIncludeAsMovementOption(row + i, col + i)) {
                    onlyOneCell ? this.doneCheckingDiagonallydownright = true : i++;
                } else {
                    this.doneCheckingDiagonallydownright = true;
                    i = 1;
                }
            }
            while(!this.doneCheckingDiagonallydownleft) {
                if (this.checkAndIncludeAsMovementOption(row + i, col - i)) {
                    onlyOneCell ? this.doneCheckingDiagonallydownleft = true : i++;
                } else {
                    this.doneCheckingDiagonallydownleft = true;
                    i = 1;
                }
            }
        }

        displayMoveOptions(row, col, pieceName, colorSelection) {
            this.clearMoveOptions();
            if (pieceName === "pawn") {
                if (row === 0 || row === 7) return
                if (colorSelection === "first") {
                    this.checkAndIncludeAsMovementOption(row - 1, col);
                    if (row === 6) {
                        this.checkAndIncludeAsMovementOption(row - 2, col);
                    }
                } else if (colorSelection === "second") {
                    this.checkAndIncludeAsMovementOption(row + 1, col);
                    if (row === 1) {
                        this.checkAndIncludeAsMovementOption(row + 2, col);
                    }
                }
            } else if (pieceName === "knight") {
                this.checkAndIncludeAsMovementOption(row - 2, col - 1);
                this.checkAndIncludeAsMovementOption(row - 2, col + 1);
                this.checkAndIncludeAsMovementOption(row - 1, col - 2);
                this.checkAndIncludeAsMovementOption(row - 1, col + 2);
                this.checkAndIncludeAsMovementOption(row + 1, col - 2);
                this.checkAndIncludeAsMovementOption(row + 1, col + 2);
                this.checkAndIncludeAsMovementOption(row + 2, col - 1);
                this.checkAndIncludeAsMovementOption(row + 2, col + 1);
            } else if (pieceName === "king") {
                this.checkPerpendicularMovementOptions(row, col, true);
                this.checkDiagonalMovementOptions(row, col, true);
            } else if (pieceName === "rook") {
                this.checkPerpendicularMovementOptions(row, col, false);
            } else if (pieceName === "bishop") {
                this.checkDiagonalMovementOptions(row, col, false);
            } else if (pieceName === "queen") {
                this.checkPerpendicularMovementOptions(row, col, false);
                this.checkDiagonalMovementOptions(row, col, false);
            }
            
            this.moveOptionCells.forEach(cell => cell.element.classList.add("activeMoveOptionCell"));
            // console.log(`CLICKED ROW: ${row} COL: ${col}`);
        }

        deactivateAllPieces() {
            this.allPiecesFromIndex.forEach(piece => {
                piece.active = false;
                piece.element.classList.remove('activePiece');
            });
        }

        findCellsToAttack(pieceName, row, col) {
            this.cellsToAttack.length = 0;
            for (let i = 0; i <= 1; i++) {
                this.cellsToAttack.push(this.allCellsFromIndex[i][i]);
            }
        }

        shoot() {
            this.findCellsToAttack();
            this.cellsToAttack.forEach(cell => {
                console.log(`${this.name} --> ${cell.row} ${cell.col}`);

                const bullet = document.createElement('div');
                bullet.style.width = this.element.style.width;
                bullet.style.height = this.element.style.height;
                bullet.classList.add('bullet');
                this.element.appendChild(bullet);
                console.log(this.element, bullet);
                
            });

            //MAKE SURE TO REMOVE THE BULLET ELEMENT AFTER THE HIT

        }
        
        slideThePiece = (event) => {    
            //MUST USE ARROW FUNCTION OTHERWISE REMOVING ALL LISTENERS WOULD REQUIRE BINDING /// AND STORING NEW REFERENCES TO DOZENS OF BOUND FUNCTIONS, ONE PER EACH POSSIBLE //MOVE DESTINATION OF A PIECE
            this.moveOptionCells.forEach(cell => {
                if (cell.element === event.target) {
                    
                    this.element.style.left = `${cell.fromLeft}px`;
                    this.element.style.top = `${cell.fromTop}px`;
                    this.parentCell.piece = "";
                    this.parentCell = cell;
                    this.parentCell.piece = this.name;

                    setTimeout(() => {
                        this.shoot();
                        }, parseInt(this.pieceMovementSpeedFromIndex + 300));
                   
                    this.clearMoveOptions();
                    this.deactivateAllPieces();
                    this.removeAllMoveDestinationListeners();
                    this.removeAllMoveDestinationListenersOfOtherPieces();   
                }
            });
        }

        addMoveDestinationListeners() {
            // console.log('ACTIVATING MOVE LISTENERS TO', this.moveOptionCells);
            for (const destinationCell of this.moveOptionCells) {
                destinationCell.element.addEventListener('click', this.slideThePiece);
            }
        }

        removeAllMoveDestinationListeners() {
            for (const destinationCell of this.moveOptionCells) {
                destinationCell.element.removeEventListener('click', this.slideThePiece);
            }
        } 

        removeAllMoveDestinationListenersOfOtherPieces() {
            this.allPiecesFromIndex.forEach((piece, index) => {
                if (index !== this.allPiecesFromIndex.indexOf(this) && piece.moveOptionCells.length) {
                    // console.log(`${piece.name} moveOptions: ${piece.moveOptionCells.length}`);
                    piece.removeAllMoveDestinationListeners();
                    console.log(`ALL MOVE LISTENERS SET BY ${piece.name} DEACTIVATED`);
                }
                });
        } 

        handlePieceClick() {
            if (this.active) {
                this.deactivateAllPieces();
                this.removeAllMoveDestinationListeners();
                this.clearMoveOptions();                
                return
            }
            this.deactivateAllPieces();
            this.element.classList.add("activePiece");
            this.active = true;
            this.displayMoveOptions(this.parentCell.row, this.parentCell.col, this.name, this.colorSelection);
            this.removeAllMoveDestinationListenersOfOtherPieces();
            this.addMoveDestinationListeners();
            // console.log(`${this.colorSelection} ${this.name} ACTIVATED: ${this.active}`);
            console.log('MY INDEX: ', this.allPiecesFromIndex.indexOf(this));    
        }
        
        createThePiece() {
            const chessPieceHTML = loaderLoadedSvgHTML[this.findPieceIndex(this.name)];
            this.parentCell.piece = this.name;
            // console.log('PIECE NAME: ', this.parentCell.piece); 
            // console.log('PARENT SIZE: ', this.parentCell.size); 
            // console.log('PIECE HTML: ', chessPieceHTML);
            this.element = document.createElement('div');
            this.element.innerHTML = chessPieceHTML;
            this.parentCell.element.appendChild(this.element);

            this.colorSelection === "first" 
            ? this.element.setAttribute('class', 'chessPieceDivColor1')
            : this.element.setAttribute('class', 'chessPieceDivColor2');

            this.fromTop = this.parentCell.fromTop;
            this.fromLeft = this.parentCell.fromLeft;
            
            this.element.style.left = `${this.fromLeft}px`;
            this.element.style.top = `${this.fromTop}px`;
            this.element.style.height = `${this.parentCell.size}px`;
            this.element.style.width = `${this.parentCell.size}px`;
            if (this.smaller) {
                this.element.classList.add('smallerSvgInside');
            }
            
            this.element.addEventListener('click', this.handlePieceClick.bind(this));
        }
        
            
}