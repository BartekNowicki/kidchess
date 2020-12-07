/* eslint-disable no-mixed-spaces-and-tabs */
import { TheDOM, DATA } from './TheDOM.js';
import allPiecesPicHTML from './assets/pieces.svg';
import startPicHTML from './assets/start.svg';
import img1 from './assets/1.jpg';
import img2 from './assets/2.jpg';
import img3 from './assets/3.jpg';
import img4 from './assets/4.jpg';
import img5 from './assets/5.jpg';

class Loader extends TheDOM {
	constructor() {
        super(DATA.LOADER_SELECTOR);
        this.areAllItemsLoaded = false;
		this.loadedItemsCounter = 0;
		this.importedSvgHTML = [allPiecesPicHTML, startPicHTML];
		this.importedPicReferences = [img1, img2, img3, img4, img5];
		this.importedPicReferences = [img1, img2];
		this.allImportedItems = [...this.importedSvgHTML, ...this.importedPicReferences];
		this.width = 0;
		this.height = 0;
        this.initializeLoader();
	}	

	resizeGameWindow() {
		const { innerWidth: width, innerHeight: height } = window;
		const scale = Math.min(width / DATA.CANVAS_BASE_WIDTH, height / DATA.CANVAS_BASE_HEIGHT);
		console.log(width, height, DATA.CANVAS_BASE_WIDTH, DATA.CANVAS_BASE_HEIGHT);		
		document.documentElement.style.setProperty("--scaleValue", scale);
		// console.log('GAME WINDOW RESIZED AGAINST BASE 360 X 640 BY SCALE: ', scale);
	}

	loadImage(imageReference) {		
		const image = new Image();
		image.src = imageReference;
		image.setAttribute('class', 'loadingTest');		
		this.element.appendChild(image);
		image.addEventListener('load', event => this.imageLoaded(event), false); 
	}

	loadSvg(svgHTML) {		
		const newDiv = document.createElement('div');
		newDiv.setAttribute('class', 'loadingTest');
		newDiv.innerHTML = svgHTML;
		newDiv.style.left = `${this.loadedItemsCounter * 0}px`;
		this.element.appendChild(newDiv);
		this.loadedItemsCounter++;
		// console.log('LOADED HTML: ', newDiv.innerHTML);
		// console.log(newDiv);		
	}

    finalItemLoaded() {
        // console.log('ALL ITEMS LOADED');
		this.areAllItemsLoaded = true;
		this.toggleVisibility(this.element, 'invisible');
		window.dispatchEvent(new CustomEvent(DATA.ITEMSLOADED_EVENT_NAME));
	}	

	imageLoaded(event) {
		event.target.removeEventListener(event.type, this.imageLoaded, false);
		this.loadedItemsCounter++;
		event.target.style.left = `${this.loadedItemsCounter * 50}px`;
		const loadedFraction = Math.floor(this.loadedItemsCounter / this.allImportedItems.length * 100);
		// console.log('FRACTION OF LOADED ITEMS: ', loadedFraction);
		let loaderInfoMessage = "'loading pieces...'" + `"  ${loadedFraction} %"`;
		document.documentElement.style.setProperty("--loaderInfo", `${loaderInfoMessage}`);
		
		if (this.loadedItemsCounter === this.allImportedItems.length) {
			this.finalItemLoaded();
		}
	}	
	
    consoleInitialInfo() {
        console.log('loader constructor here');
		console.log('loader element: ', this.element);
        console.log('loader this: ', this);
	}	

	loadAllItems() {
		for (let i = 0; i <= this.importedPicReferences.length - 1; i++) {
			this.loadImage(this.importedPicReferences[i]);			
		}
		for (let j = 0; j <= this.importedSvgHTML.length - 1; j++) {
			this.loadSvg(this.importedSvgHTML[j]);			
		}
	}
	    
    initializeLoader() {
		this.toggleVisibility(this.element, 'visible');
		this.width = this.element.getBoundingClientRect().width;
		this.height = this.element.getBoundingClientRect().height;
		// console.log('LOADER WIDTH: ', this.width);
		// console.log('LOADER HEIGHT: ', this.height);
		
		console.log('NUMBER OF IMPORTED ITEMS: ', this.allImportedItems.length);
		// // this.consoleInitialInfo();
		this.resizeGameWindow();
		window.addEventListener('resize', this.resizeGameWindow);
		this.loadAllItems();
    }
}

export const loader = new Loader();
// export const ITEMSLOADED_EVENT_NAME = 'itemsLoaded';
// export const STARTGAME_EVENT_NAME = 'gameStartRequested';

//REMOVE THIS:
// this.element.style.backgroundPosition = `${this.width} center`;
// this.element.style.backgroundImage = `url('${loaderPic}')`;
// this.element.style.backgroundRepeat = "no-repeat";
// this.element.style.backgroundSize = this.width + 'px';	

// let x = window.getComputedStyle(image).getPropertyValue('fill');
// console.log('x', x)
