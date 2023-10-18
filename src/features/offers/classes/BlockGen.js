
const block = {
		"colSpan": 2,
		"rowSpan": 1,
		"index": 0,
		"name": null,
		"linkUrl": "",
		"aspectRatio": 1,
		"products": [],
		"images": [],
		"text": null,
		"placement": {}
	};

/*const blockImages = [
	{
		"resolution": 96,
		"image": "",
		"width": 561,
		"height": 178
	},
	{
		"resolution": 150,
		"image": "",
		"width": 877,
		"height": 278
	},
	{
		"resolution": 300,
		"image": "",
		"width": 1754,
		"height": 556
	}
];*/

const blockPlacements = {
	"desktop":
		{
			"visible": true,
			"order": 0
		},
	"tablet":
		{
			"visible": true,
			"order": 0
		},
	"mobile":
		{
			"visible": true,
			"order": 0
		}
}
/*
const genBlock = (colSpan, rowSpan, unitWidth, unitHeight, visibility = {}) => {
	return Object.assign({}, block, {colSpan, rowSpan, unitWidth, unitHeight, aspectRatio: (unitWidth * colSpan) / (unitHeight * rowSpan), placement: genVisibility(visibility)});
}*/
const genVisibility = (visibility = {}) => {
	return Object.assign({}, blockPlacements, visibility);
}

export default class BlockGen {
	static GenBlock(colSpan, rowSpan, unitWidth, unitHeight, visibility = {}, extra = {}) {
		return Object.assign({}, block, {colSpan, rowSpan, unitWidth, unitHeight, aspectRatio: (unitWidth * colSpan) / (unitHeight * rowSpan), placement: genVisibility(visibility)}, extra);
	}
}
