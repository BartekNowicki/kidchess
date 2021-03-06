import { gsap } from "gsap";

import { DATA } from './TheDOM.js';

import { loaderLoadedSvgHTML, allCells, allPieces, pieceMovementSpeed } from './index.js';

import { currentTurn } from './Game.js';

import { busyDoingStuff, mainBoardElement } from './Board.js';

export class Piece {
        constructor (pieceName, parentCell, colorSelection, smaller) {
            this.name = pieceName;
            this.parentCell = parentCell;
            this.colorSelection = colorSelection;
            this.enemyColorSelection = null;
            this.smaller = smaller;
            this.element = null;
            this.fromTop = null;
            this.fromLeft = null;
            this.active = false;
            this.moveOptionCells = [];
            this.piecesToAttack = [];
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
            this.colorOfExaminedCellBorders = "orange";
            this.colorOfFoundTargetBorders = "yellowgreen";
            this.currentTurnFromGame = currentTurn; 
            this.tookHits = 0;
            this.busyDoingStuffFromBoard = busyDoingStuff;
            this.cellMarkingTime = 1000;
            this.bulletFlyTime = 1;
            this.maxDamageAllowed = 3;
            this.createThePiece();            
        }

        //FINDS A STRING AMONG ALL LOADED SVG HTMLS
        findContentIndex(piece) {
            let index = -1;
            loaderLoadedSvgHTML.forEach(item => {
              if (item.includes(piece)) {
                index = loaderLoadedSvgHTML.indexOf(item);
              }
            });
            return index
        }

        clearMoveOptions() {
            this.allCellsFromIndex.flat().forEach(cell => {
                cell.element.style.border = "1px solid transparent";
                //NEED THIS AS THOSE BORDERS WILL GET CLEARED TO
                this.markSideToMove(false);
            });
                        
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
                    if (row === 6 && this.checkAndIncludeAsMovementOption(row - 1, col)) {
                        this.checkAndIncludeAsMovementOption(row - 2, col);
                    }
                } else if (colorSelection === "second") {
                    this.checkAndIncludeAsMovementOption(row + 1, col);
                    if (row === 1 && this.checkAndIncludeAsMovementOption(row + 1, col)) {
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
            
            this.moveOptionCells.forEach(cell => {
                cell.element.style.border = "1px dashed rgba(163, 4, 4, 1)";
            }); 
            // console.log(`CLICKED ROW: ${row} COL: ${col}`);
        }

        deactivateAllPieces() {
            this.allPiecesFromIndex.forEach(piece => {
                piece.active = false;
                piece.element.classList.remove('activePiece');
            });
        }

        markTheCellIfItExists(row, col, color) {            
            if (this.allCellsFromIndex[row] && this.allCellsFromIndex[row][col]) {     
                        this.allCellsFromIndex[row][col].element.style.border = "1px dashed " + color;
                        setTimeout(() => { 
                            this.allCellsFromIndex[row][col].element.style.border = "1px solid transparent"; 
                            //NEED THIS AS THOSE BORDERS WILL GET CLEARED TO
                           this.markSideToMove(false);
                        }, this.cellMarkingTime);                                     
                }                 
        }

        knightLooksForEnemyCells(row, col, colorSelection) {
            this.markTheCellIfItExists(row, col, this.colorOfExaminedCellBorders);  
            this.enemyColorSelection = this.colorSelection === "first" ? "second" : "first";                              
            if (this.allCellsFromIndex[row] 
                && this.allCellsFromIndex[row][col] 
                && this.allCellsFromIndex[row][col].piece !== "" 
                && this.allCellsFromIndex[row][col].pieceColorSelection !== colorSelection) {
                return this.allCellsFromIndex[row][col];
                }                
        }

        lookForEnemyCells(direction, onlyOneCell = false) {            
            let i = 1;
            //itertors will allow to switch directions when looking
            let RLiterator;
            let UDiterator;
            let rightLeftSwitch;
            let upDownSwitch;
            let row = this.parentCell.row;
            let col = this.parentCell.col;
            if (direction === "upLeft") {
                rightLeftSwitch = 1;
                upDownSwitch = 1;
            } else if (direction === "downLeft") {
                rightLeftSwitch = 1;
                upDownSwitch = -1;
            } else if (direction === "upRight") {
                rightLeftSwitch = -1;         
                upDownSwitch = 1;       
            } else if (direction === "downRight") {
                rightLeftSwitch = -1;         
                upDownSwitch = -1;       
            }  else if (direction === "left") {
                rightLeftSwitch = 1;         
                upDownSwitch = 0;       
            }  else if (direction === "right") {
                rightLeftSwitch = -1;         
                upDownSwitch = 0;       
            }  else if (direction === "up") {
                rightLeftSwitch = 0;         
                upDownSwitch = 1;       
            }  else if (direction === "down") {
                rightLeftSwitch = 0;         
                upDownSwitch = -1;       
            } 

            
            // console.log('SWITCH::::::', direction, rightLeftSwitch);
            let keepLooking = true;
            this.enemyColorSelection = this.colorSelection === "first" ? "second" : "first";
            // console.log(`LOOKING FOR ${enemyColorSelection} ENEMIES ${direction}`);

            while (keepLooking) {
                RLiterator = i * rightLeftSwitch; //RL = RIGHT-LEFT
                UDiterator = i * upDownSwitch; //UD = UP-DOWN
                // TEST TO SEE WHERE LOOKING FOR ENEMY CELLS
                this.markTheCellIfItExists(row - UDiterator, col - RLiterator, this.colorOfExaminedCellBorders);
                                
                if (this.allCellsFromIndex[row - UDiterator]
                    && this.allCellsFromIndex[row - UDiterator][col - RLiterator] 
                    && this.allCellsFromIndex[row - UDiterator][col - RLiterator].piece !== "")
                    {
                        keepLooking = false;
                        if (this.allCellsFromIndex[row - UDiterator][col - RLiterator].pieceColorSelection !== this.enemyColorSelection) return null
                        return this.allCellsFromIndex[row - UDiterator][col - RLiterator]
                    } else {
                        if (onlyOneCell) return null
                        // console.log('looking...', i, keepLooking);
                        i === 8 ? keepLooking = false : i++;                        
                    }                  
            }  
            return null          

        }

        putCellPieceOnTargetList(cell) {
            this.allPiecesFromIndex.forEach(piece => {
                if (piece.parentCell === cell) {
                    this.piecesToAttack.push(piece);
                }
            });
        }

        findPiecesToAttack() {
            if (this.name === "pawn") {
                if (this.row === 0 || this.row === 7) return
            }
            this.piecesToAttack.length = 0;

            if (this.name === "pawn" && this.colorSelection === "first") {
                this.lookForEnemyCells("upLeft", true) 
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upLeft", true))
                // : console.log('NO ENEMIES FOUND UP LEFT...');
                : null;

                this.lookForEnemyCells("upRight", true)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upRight", true))
                // : console.log('NO ENEMIES FOUND UP RIGHT...');
                :null;
                
            } else if (this.name === "pawn" && this.colorSelection === "second") {
                this.lookForEnemyCells("downLeft", true)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downLeft", true))
                // : console.log('NO ENEMIES FOUND DOWN LEFT...');
                : null;

                this.lookForEnemyCells("downRight", true)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downRight", true))
                // : console.log('NO ENEMIES FOUND DOWN RIGHT...');
                :null;
            } else if (this.name === "king" || this.name === "queen") {

                const onlyOneCell = this.name === "king" ? true : false;
                this.lookForEnemyCells("upLeft", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upLeft", onlyOneCell))
                // : console.log('NO ENEMIES FOUND UP LEFT...');
                :null;

                this.lookForEnemyCells("upRight", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upRight", onlyOneCell))
                // : console.log('NO ENEMIES FOUND UP RIGHT...')
                : null;

                this.lookForEnemyCells("downLeft", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downLeft", onlyOneCell))
                // : console.log('NO ENEMIES FOUND DOWN LEFT...');
                : null;

                this.lookForEnemyCells("downRight", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downRight", onlyOneCell))
                // : console.log('NO ENEMIES FOUND DOWN RIGHT...');
                : null;

                this.lookForEnemyCells("left", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("left", onlyOneCell))
                // : console.log('NO ENEMIES FOUND LEFT...');
                : null;

                this.lookForEnemyCells("right", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("right", onlyOneCell))
                // : console.log('NO ENEMIES FOUND RIGHT...');
                : null;

                this.lookForEnemyCells("down", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("down", onlyOneCell))
                // : console.log('NO ENEMIES FOUND DOWN...');
                : null;
                
                this.lookForEnemyCells("up", onlyOneCell)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("up", onlyOneCell))
                // : console.log('NO ENEMIES FOUND UP...');
                : null;
            } else if (this.name === "rook") { 
                this.lookForEnemyCells("left", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("left", false))
                // : console.log('NO ENEMIES FOUND LEFT...');
                : null;

                this.lookForEnemyCells("right", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("right", false))
                // : console.log('NO ENEMIES FOUND RIGHT...');
                : null;

                this.lookForEnemyCells("down", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("down", false))
                // : console.log('NO ENEMIES FOUND DOWN...');
                : null;
                
                this.lookForEnemyCells("up", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("up", false))
                // : console.log('NO ENEMIES FOUND UP...');
                : null;
            } else if (this.name === "bishop") { 
                this.lookForEnemyCells("upLeft", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upLeft", false))
                // : console.log('NO ENEMIES FOUND UP LEFT...');
                : null;

                this.lookForEnemyCells("upRight", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("upRight", false))
                // : console.log('NO ENEMIES FOUND UP RIGHT...');
                : null;

                this.lookForEnemyCells("downLeft", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downLeft", false))
                // : console.log('NO ENEMIES FOUND DOWN LEFT...');
                : null;

                this.lookForEnemyCells("downRight", false)
                ? this.putCellPieceOnTargetList(this.lookForEnemyCells("downRight", false))
                // : console.log('NO ENEMIES FOUND DOWN RIGHT...');                
                : null;
            } else if (this.name === "knight") {

                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row - 2, this.parentCell.col - 1, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row - 2, this.parentCell.col + 1, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row - 1, this.parentCell.col - 2, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row - 1, this.parentCell.col + 2, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row + 1, this.parentCell.col - 2, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row + 1, this.parentCell.col + 2, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row + 2, this.parentCell.col - 1, this.colorSelection));
                this.putCellPieceOnTargetList(this.knightLooksForEnemyCells(this.parentCell.row + 2, this.parentCell.col + 1, this.colorSelection));
            }
        }

        timelineShootBullet() {
            return gsap.timeline();
        }

        timelineKillPiece() {
            return gsap.timeline();
        }

        removePiece(removedPiece) {
            removedPiece.element.innerTxt = '';
            removedPiece.element.outerHTML = '';
            removedPiece.element.remove();
            const indexus = this.allPiecesFromIndex.findIndex(piece=>piece === removedPiece);
            console.log(`REMOVING PIECE INDEX: ${indexus}`);
            // this.allPiecesFromIndex[indexus] && console.log( "REMOVING FROM PIECES: ", this.allPiecesFromIndex[indexus].name);
            this.allPiecesFromIndex.splice(indexus, 1);
            // console.log('LENGTH: ',this.allPiecesFromIndex.length);
            this.busyDoingStuffFromBoard = false;
            // console.log('PIECE REMOVED, NOT BUSY ANYMORE...');
        }

        destroyAllPieces() {
            
            while (this.allPiecesFromIndex.length) {
                this.removePiece(this.allPiecesFromIndex[0])
            }
            console.log('NUMBER OF PIECES PRESENT: ', this.allPiecesFromIndex.length);
            //EXAMINE FURTHER WHY ALL LOOPS BELOW WOULD REMOVE ONLY HALF OF THE PIECES
            // for (const piece of this.allPiecesFromIndex) {
            //     this.removePiece(piece);
            // } 
            // this.allPiecesFromIndex.forEach(item => this.removePiece(item));
            // this.allPiecesFromIndex.forEach(item => this.removePiece(item));
            // this.allPiecesFromIndex.forEach(item => this.removePiece(item));
            // this.allPiecesFromIndex.length = 0;    
            // console.log('PIECES ARRAY EMPTY: ', this.allPiecesFromIndex);
        }

        playAgain() {
            console.log('ANOTHER GAME REQUESTED');
            //NEED WHILE AS REFERENCES LINGER:
            while (document.querySelector('.boardOverlayerDiv')) {
                document.querySelector('[data-mainWrap]').removeChild(document.querySelector('.boardOverlayerDiv'));
            }                        
            this.destroyAllPieces();
            window.dispatchEvent(new CustomEvent(DATA.STARTGAME_EVENT_NAME));
        }

        endGame(timeline, kingPiece) {
            const boardOverlayerDiv = document.createElement('div');
            boardOverlayerDiv.classList.add('boardOverlayerDiv'); 
            
            document.querySelector('[data-mainWrap]').appendChild(boardOverlayerDiv);
            
            const winnerInfoDiv = document.createElement('p');
            winnerInfoDiv.classList.add('winnerInfoDiv');            
            boardOverlayerDiv.appendChild(winnerInfoDiv);

            let winnerKingDiv = document.createElement('div');            
            winnerKingDiv.innerHTML = loaderLoadedSvgHTML[this.findContentIndex("king")];
            boardOverlayerDiv.appendChild(winnerKingDiv);
            kingPiece.colorSelection === "first"
            ? winnerKingDiv.classList.add('winnerKingDivsecond')
            : winnerKingDiv.classList.add('winnerKingDivfirst');
            console.log('winnerKingDiv',winnerKingDiv);

            const playAgainDiv = document.createElement('div');
            playAgainDiv.classList.add('playAgainDiv');
            
            //THIS LISTENER IS NOT REMOVED:
            playAgainDiv.addEventListener('click', () => {            
                mainBoardElement.classList.remove('blurMe');
                this.playAgain(playAgainDiv);
            });

            boardOverlayerDiv.appendChild(playAgainDiv);
            // console.log(playAgainDiv);                      
                                                
            mainBoardElement.classList.add('blurMe');
            timeline.set(winnerKingDiv,  {transformOrigin: '50% 50%'});
            timeline.to(winnerKingDiv, {scale: 4, duration: 0.5, onComplete: () => {
                winnerInfoDiv.innerText = "YOU WIN!";
                playAgainDiv.innerText = "PLAY AGAIN";
            }}).delay(0);
            // timeline.to(winnerKingDiv, {boxShadow:"0 0 25px red", duration: 0.3});
            timeline.to(playAgainDiv, {opacity: 1, duration: 0.3, delay: 2});          
        }

        pieceKilled(killedPiece) {
            const el = killedPiece.element;
            // console.log('ELEMENT TO KILL: ', el);
            let tl2 = this.timelineKillPiece();
            tl2.to(el, {rotation: 360, opacity: 0, duration: 0.3, onComplete: () => { 
                // console.log('KILLED!');
                    killedPiece.parentCell.resetCellToEmpty();
                    if (killedPiece.name !== "king") {
                        tl2.kill();
                        this.removePiece(killedPiece);
                    } else {
                        setTimeout(() => {this.endGame(tl2, killedPiece)}, 2000);
                        
                    }                
                }
            });
        }
        
        targetTakeHit(hitPiece) {
            //UNCOMMENT ONLY TO TEST FAST KILLS:
            // this.pieceKilled(hitPiece); 
            // return

            hitPiece.element.style.boxShadow = "0 0 25px red";
            setTimeout(() => hitPiece.element.style.boxShadow = "", 500);

            hitPiece.tookHits++;
            if (hitPiece.tookHits === 1) {
                hitPiece.colorSelection === "first" 
                ? hitPiece.element.classList.add('firstHitOnce')
                : hitPiece.element.classList.add('secondHitOnce');
            } else if (hitPiece.tookHits === 2) {
                hitPiece.colorSelection === "first" 
                ? hitPiece.element.classList.add('firstHitTwice')
                : hitPiece.element.classList.add('secondHitTwice');
            } else if (hitPiece.tookHits === 3) {
                this.pieceKilled(hitPiece);                
            }
        }

        makeBulletDiv() {
            const bulletDiv = document.createElement('div');                
            //MAKE SURE SVG CONTAINS <g id="bullet"> 
            bulletDiv.innerHTML = loaderLoadedSvgHTML[this.findContentIndex("bullet")];
            bulletDiv.style.width = this.element.style.width;
            bulletDiv.style.height = this.element.style.height;
            bulletDiv.classList.add('bulletDiv');
            return bulletDiv;
        }

        checkIfEnemyPieceHasMeInRange(enemyPiece) {
            // console.log('CHECKING IF I AM IN RANGE OF ', enemyPiece.element);

            enemyPiece.colorOfExaminedCellBorders = "transparent";
            enemyPiece.findPiecesToAttack();
            enemyPiece.colorOfExaminedCellBorders = this.colorOfExaminedCellBorders;

            // console.log(enemyPiece.piecesToAttack);
            // console.log('IM AM ON ENEMY LIST AS NR:  ', enemyPiece.piecesToAttack.indexOf(this));
            return enemyPiece.piecesToAttack.indexOf(this) !== -1;            
        }
        
        doBattle() {
            this.busyDoingStuffFromBoard = true;
            console.log('BUSY CHECKING IF BATTLE OR DOING BATTLE!');
            let bullets = [];
            let bulletsHittingBack = [];
            this.findPiecesToAttack();
            const tl = this.timelineShootBullet();           
            this.piecesToAttack.forEach(piece => {
                //console.log(`${this.name} --> ${cell.row} ${cell.col}`);
                piece.element.style.border = `1px solid ${this.colorOfFoundTargetBorders}`;
                setTimeout(() => {
                    piece.element.style.border = "1px solid transparent";
                    //NEED THIS AS THOSE BORDERS WILL GET CLEARED TO
                    this.markSideToMove(false);
                }, this.cellMarkingTime);

                const bulletDiv = this.makeBulletDiv();
                const bulletHittingBackDiv = this.makeBulletDiv();
                this.element.appendChild(bulletDiv);
                this.element.appendChild(bulletHittingBackDiv);
                bullets.push(bulletDiv);
                bulletsHittingBack.push(bulletHittingBackDiv);
            });

            bullets.length === this.piecesToAttack.length 
            ? console.log(`MADE ${bullets.length} BULLETS FOR ${this.piecesToAttack.length} enemies`)
            : console.warn('INCORRECT NUMBER OF CREATED BULLETS!');
            
                for (let i = 0; i <= bullets.length - 1; i++) {
                   
                    console.log('FIRING BULLET ', i);
                    const targetCol = this.piecesToAttack[i].parentCell.col;
                    const targetRow = this.piecesToAttack[i].parentCell.row;
                    const deltaX = (targetCol - this.parentCell.col) * this.parentCell.size;
                    const deltaY = (targetRow - this.parentCell.row) * this.parentCell.size;
                    // console.log(`TARGET ROW: ${targetRow} COL: ${targetCol}`);
                    // console.log(`DELTA X: ${deltaX} DELTA Y: ${deltaY}`);
                    //THE DESTINATION DISTANCE HERE IS RELATIVE TO THE BULLET DIV

                    //***** BATTLE ANIMATION SEQUENCE*****/////
                    bullets[i].classList.add(`bulletDiv${this.colorSelection}`);
                    bulletsHittingBack[i].classList.add(`bulletDiv${this.enemyColorSelection}`);

                    tl.to(bullets[i], {opacity: 1, duration: 0.3}).delay(0.3);
                    
                    tl.to(bullets[i], {x: deltaX, y: deltaY, rotation: 1500, repeat: 0, duration: this.bulletFlyTime, ease: "none", yoyo: false, onComplete: () => {
                        // console.log(bullets[i]);
                        this.targetTakeHit(this.piecesToAttack[i]);

                        // mark UNCOMMENT ONLY TO TEST FAST GAME END UPON FIRST DAMAGE POINT:  
                        // setTimeout(() => {this.endGame(tl, this.piecesToAttack[i])}, 1000);

                    }});

                    // console.log(`TARGET HAS ${this.piecesToAttack[i].maxDamageAllowed - this.piecesToAttack[i].tookHits } DAMAGE POINTS LEFT`);
                    
                    tl.to(bullets[i], {opacity: 0, duration: 0.3, onComplete: () => {
                        bullets[i].remove();
                    }}); 
                    
                    //HITS BACK ONLY IF:
                    // 1) HAS NOT JUST BEEN KILLED
                    // 2) HAS THE AGGRESSOR IN RANGE
                    if ((this.piecesToAttack[i].tookHits < this.piecesToAttack[i].maxDamageAllowed - 1) 
                    && (this.checkIfEnemyPieceHasMeInRange(this.piecesToAttack[i]))) {                  

                        tl.set(bulletsHittingBack[i], {x: deltaX, y: deltaY});

                        tl.to(bulletsHittingBack[i], {opacity: 1, duration: 0.3});
                        
                        tl.to(bulletsHittingBack[i], {x: 0, y: 0, rotation: 1500, repeat: 0, duration: this.bulletFlyTime, ease: "none", yoyo: false, onComplete: () => {
                            // console.log(bulletsHittingBack[i]);
                            this.targetTakeHit(this);

                            // console.log(`I CAN STILL TAKE ${this.maxDamageAllowed - this.tookHits} MORE HITS`);
                            if (this.maxDamageAllowed === this.tookHits) {
                                    tl.kill();
                                    // return console.log('QUITTING BATTLE!');
                            } 
                        }});

                        tl.to(bulletsHittingBack[i], {opacity: 0, duration: 0.3, onComplete: () => {
                            this.busyDoingStuffFromBoard = false; 
                            bulletsHittingBack[i].remove();
                            console.log('NOT BUSY HITTING BACK ANYMORE...');
                            
                        }}); 
                    } else {
                        console.log('TARGET NOT HITTING BACK - DYING OR CANNOT REACH ME :)');
                    }
                }   

            // bullets.forEach(bullet => console.log(bullet));
            // bulletsHittingBack.forEach(bullet => console.log(bullet));
            this.switchTurns();   
        }

        markSideToMove(flash = false) {

            if (flash) {
                console.log('NOT YOUR TURN!!!, FIRST PLAYER NOW: ', this.currentTurnFromGame.turnFirstPlayer);
                this.allCellsFromIndex.flat().forEach(cell => {                    
                    if (cell.row === 0) {
                        this.currentTurnFromGame.turnFirstPlayer 
                        ? cell.element.style.borderTop = "0px solid black"
                        : cell.element.style.borderTop = "5px solid yellow";
                    } else if (cell.row === 7) {
                        this.currentTurnFromGame.turnFirstPlayer 
                        ? cell.element.style.borderBottom = "5px solid yellow"
                        : cell.element.style.borderBottom = "0px solid black";
                    }
                    setTimeout(() => this.markSideToMove(false), 300);
                });
            } else {
                this.allCellsFromIndex.flat().forEach(cell => {
                    if (cell.row === 0) {
                        this.currentTurnFromGame.turnFirstPlayer 
                        ? cell.element.style.borderTop = "0px solid black"
                        : cell.element.style.borderTop = "3px solid var(--pieceColor2)";
                    } else if (cell.row === 7) {
                        this.currentTurnFromGame.turnFirstPlayer 
                        ? cell.element.style.borderBottom = "3px solid var(--pieceColor1)"
                        : cell.element.style.borderBottom = "0px solid black";
                    }
                });
            }
        }

        switchTurns() {
            // console.log('NOW FIRST PLAYER: ', this.currentTurnFromGame.turnFirstPlayer);
            this.currentTurnFromGame.turnFirstPlayer = !this.currentTurnFromGame.turnFirstPlayer;            
            // console.log('NOW FIRST PLAYER: ', this.currentTurnFromGame.turnFirstPlayer);
            this.markSideToMove(false);
            this.busyDoingStuffFromBoard = false;
            console.log('SWITCHING TURNS, NOT BUSY ANYMORE...');
        }

        addRocketAnimation() {
            let distanceFromTop;
            switch (this.name) {
                case 'pawn':
                    distanceFromTop = 8;
                break;
                case 'knight':
                    distanceFromTop = 14;
                break;
                case 'queen':
                    distanceFromTop = 17;
                break;
                case 'king':
                    distanceFromTop = 17;
                break;
                case 'bishop':
                    distanceFromTop = 14;
                break;
                case 'rook':
                    distanceFromTop = 14;
                break;                
                default:
                    distanceFromTop = 14;
              }
            const exhaustDiv = document.createElement('div');
            // console.log('EXHAUST DIV: ', exhaustDiv);
            exhaustDiv.classList.add('rocketFuel');
            exhaustDiv.style.top = `calc(50% + ${distanceFromTop}px)`;
            this.element.appendChild(exhaustDiv);
            setTimeout(() => {
                exhaustDiv.classList.remove('rocketFuel');
                exhaustDiv.remove();
            }, parseInt(this.pieceMovementSpeedFromIndex));
        }
        
        slideThePiece = (event) => {      
            //MUST USE ARROW FUNCTION OTHERWISE REMOVING ALL LISTENERS WOULD REQUIRE BINDING /// AND STORING NEW REFERENCES TO DOZENS OF BOUND FUNCTIONS, ONE PER EACH POSSIBLE //MOVE DESTINATION OF A PIECE
            this.moveOptionCells.forEach(cell => {
                if (cell.element === event.target) {
                    this.busyDoingStuffFromBoard = true; 
                    // console.log('THIS: ', this.element);
                    // console.log('BUSY SLIDING TO', cell.element);
                    this.addRocketAnimation();
                    this.element.style.left = `${cell.fromLeft}px`;
                    this.element.style.top = `${cell.fromTop}px`;
                    this.parentCell.piece = "";
                    this.parentCell = cell;
                    this.parentCell.piece = this.name;
                    this.parentCell.pieceColorSelection = this.colorSelection;
                    
                    //EITHER SETTIMEOUT OR LISTENER FOR ANIMATIONEND
                    setTimeout(() => {
                        this.doBattle();
                    }, parseInt(this.pieceMovementSpeedFromIndex));                    
                   
                    this.clearMoveOptions();
                    this.deactivateAllPieces();
                    this.removeAllMoveDestinationListeners();
                    this.removeAllMoveDestinationListenersOfOtherPieces(); 

                    this.busyDoingStuffFromBoard = false; 
                    console.log('NOT BUSY SLIDING ANYMORE...');
                                      
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
                    // console.log(`ALL MOVE LISTENERS SET BY ${piece.name} DEACTIVATED`);
                }
                });
        } 

        alertWhoseTurn() {
            // console.log('NOT YOUR TURN!!!');
            this.markSideToMove(true)
        }

        handlePieceClick() {

            console.log('CHECKING IF BUSY WHEN CLICKED: ', this.busyDoingStuffFromBoard);

            if (this.busyDoingStuffFromBoard) return

            if (this.currentTurnFromGame.turnFirstPlayer && this.colorSelection === "second" || !this.currentTurnFromGame.turnFirstPlayer && this.colorSelection === "first" ) {
                this.alertWhoseTurn();
                console.log('FIRST NOW: ', this.currentTurnFromGame.turnFirstPlayer);
                console.log('CLICKED COLOR SELECTION: ', this.colorSelection === "second");
                return
            } 

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
            this.currentTurnFromGame = currentTurn;
            const chessPieceHTML = loaderLoadedSvgHTML[this.findContentIndex(this.name)];
            this.parentCell.piece = this.name;
            this.parentCell.pieceColorSelection = this.colorSelection;
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