import AppConfig from "@/classes/AppConfig";
let pageBounds = [];
let pageMode = 'desktop';

let schema = {
	"id": "search_results_page",
	"flyerId": "0000000000",
	"name": "search_results",
	"documentName": "",
	"inDesignId": 0,
	"index": 1,
	"width": 0,
	"height": 0,
	"basebars": {
		"desktop": {
			"image": "",
			"visible": false
		},
		"tablet": {
			"image": null,
			"visible": false
		},
		"mobile": {
			"image": null,
			"visible": false
		}
	},
	"type": {
		"layout": 0,
		"unitWidth": 140.4,
		"unitHeight": 133.5,
		"grids": {
			"desktop": {
				"rowCount": 4,
				"colCount": 5,
				"totalBlocks": 20,
				"type": 0,
				"name": "Desktop"
			},
			"tablet": {
				"rowCount": 4,
				"colCount": 5,
				"totalBlocks": 20,
				"type": 1,
				"name": "Tablet"
			},
			"mobile": {
				"rowCount": 7,
				"colCount": 3,
				"totalBlocks": 21,
				"type": 2,
				"name": "Mobile"
			}
		}
	},
	"blocks": []
}

function getSchema(){
	return JSON.parse(JSON.stringify(schema));
}

function calcGrids(blocks){
	let totalBlocks = 0;
	for(let i=0; i < blocks.length; i++) {
		const block = blocks[i];
		totalBlocks += block.rowSpan * block.colSpan;
	}

	const gridSchema = {
		"desktop": {
			"rowCount": 4,
			"colCount": 5,
			"totalBlocks": totalBlocks,
			"type": 0,
			"name": "Desktop"
		},
		"tablet": {
			"rowCount": 5,
			"colCount": 4,
			"totalBlocks": totalBlocks,
			"type": 1,
			"name": "Tablet"
		},
		"mobile": {
			"rowCount": 5,
			"colCount": 4,
			"totalBlocks": totalBlocks,
			"type": 2,
			"name": "Mobile"
		}
	}

	for(let p in gridSchema){
		const mode = gridSchema[p];
		const rowCount = mode.rowCount;
		
		switch(p){
			case 'tablet':
				if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase())){
					mode.colCount = 3
			   }
			break;
			case 'desktop':
				mode.colCount = Math.max(mode.colCount, Math.ceil(totalBlocks / rowCount));
			break;

			case 'mobile':
				if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase())){
					 mode.colCount = 3
				}
			break;

		}
	}

	return gridSchema;
}

export default class Page{
	static GenerateSearchPage(blocks, pageType = null){
		let schema = getSchema();
		schema.blocks = blocks;
		if(pageType){
			console.log('DefPage:', pageType)
			schema.type = JSON.parse(JSON.stringify(pageType))
		}

		schema.grids = calcGrids(blocks);

		return schema;
	}

	static SetDefPage(page) {
		// this function was updated to handle type attributes moving into the parent object in api -TK
		
		const pageType = (({
			grids,
			id,
			layout,
			pageTypeName,
			unitHeight,
			unitWidth,
		}) => ({ grids, id, layout, pageTypeName, unitHeight, unitWidth }))(
			page
		);
		
		if (page) schema = { ...schema, ...pageType };
	}

	static GetBaseScale(){

		const gridContainer = document.getElementsByClassName('grid-container');

		if(!gridContainer[0])return 1;

		const containerBounds = gridContainer[0].getBoundingClientRect();
		//const headerBounds = document.getElementsByTagName('header')[0].getBoundingClientRect();
		const baseBar = 30.88 + 20 + 22 //20 for the scrollbar + 22 for legal;
		const boxHeight = 133.5;
		const gridHeight = baseBar + boxHeight * 4;
		return containerBounds.height / gridHeight;
	}

	static GetCenterOrigin(){
		const container = document.getElementsByClassName('grid-container')[0];
		if(container){
			const scroll = Math.abs(container.scrollLeft);
			return scroll + window.innerWidth / 2
		}
		return 0;
	}

	static SetMode(mode){
		pageMode = mode;
	}

	//This doesn't work yet....
	static ScrollCenterOrigin(scaleDiff){

		const container = document.getElementsByClassName('grid-container')[0];
		if(container){
			const maxScroll = container.scrollWidth;
			const scrollDiff = maxScroll * scaleDiff;

			console.log('scaleDiff:', scaleDiff, '   maxScroll:', maxScroll,  '  Scroll Diff:', scrollDiff);
			return container.scrollLeft -= scrollDiff;
		}
	}

	static UpdatePageBounds(){
		pageBounds = [];
		//const mode = pageMode;
		const pages = document.querySelectorAll('.responsive-grid .section-container[page-id]');
		for(let i=0; i < pages.length; i++){
			const page = pages[i];
			pageBounds.push(page);
		}

		//console.log('Pages Found:', pageBounds)
	}

	static GetTotalPages(){
		return pageBounds.length;
	}

	static GetCurrentPage(totalPages) {
		//const mode = pageMode;
		const container = document.getElementsByClassName('grid-container')[0];
		if(container){

			//Lets do a little cheat...

			const containerBounds = container.getBoundingClientRect();

			const bhw = (pageMode == 'mobile'? 'height':'width');
			//const btl = (pageMode == 'mobile'? 'top':'left');
			//const bbr = (pageMode == 'mobile'? 'bottom':'right');

			const scrollMax = container[bhw == 'height'? 'scrollHeight': 'scrollWidth'];
			const containerMax = containerBounds[bhw]

			console.log('scrollMax:', scrollMax, '  containerMax:', containerMax)

			const maxLeft = scrollMax  - containerMax;

			console.log('maxScroll:', maxLeft)


			return Math.round((container[bhw == 'height'? 'scrollTop': 'scrollLeft'] / maxLeft) * totalPages) || 1;


			/*
			for(let i=0; i < pageBounds.length; i++){
				const bounds = pageBounds[i].getBoundingClientRect();
				const tol = (bounds[bhw] * 0.8) >= Math.abs(bounds[btl]); //if 80% of page is visible

				if(tol){
					return i + 1;
				}
			}*/
		}

		return 1;

	}
}
