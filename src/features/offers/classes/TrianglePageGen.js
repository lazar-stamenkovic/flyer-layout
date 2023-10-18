import BlockGen from "@/features/offers/classes/BlockGen";
import TriangleRewardsCard from "@/features/offers/TriangleRewardsCard.vue";

export default (pages, pagesIndex, insertPageNum, unitWidth, unitHeight, lang) => {

	const offerPage = {
		"id": "triangleRewards",
		"publicationId": "triangleRewards",
		"name": "triangleRewards",
		"index": 4,
		"width": 0,
		"height": 0,
		"isAdPage": false,
		"disclaimer": null,
		"unitWidth": unitWidth,
		"unitHeight": unitHeight,
		"countTowardsPageCount": false,
		"basebars": {
			"desktop": [
				{
					"resolution": 300,
					"aspectRatio": 16.1296,

					"image": lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				},
				{
					"resolution": 150,
					"aspectRatio": 16.1296,
					"image":lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				}],
			"tablet": [
				{
					"resolution": 300,
					"aspectRatio": 26.889,
					"image": lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				},
				{
					"resolution": 150,
					"aspectRatio": 26.889,
					"image": lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				}],
			"mobile": [
				{
					"resolution": 300,
					"aspectRatio": 13.936,
					"image": lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				},
				{
					"resolution": 150,
					"aspectRatio": 13.936,
					"image": lang === 'en'? "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_EN.jpg": "/images/triangle/basebars/300dpi/Desktop_Weekly Offers_FR.jpg",
					// "url": "https://triangle.canadiantire.ca/en.html"
					"url": lang === "en" ? "https://triangle.canadiantire.ca/en.html" : "https://triangle.canadiantire.ca/fr.html"
				}]
		},
		"grids":
			{
				"desktop":
					{
						"rowCount": 4,
						"colCount": 3
					},
				"tablet":
					{
						"rowCount": 4,
						"colCount": 3,
						"fitCols": 5,
						"style": {
							"fontSize": "13px"
						}
					},
				"mobile":
					{
						"rowCount": 5,
						"colCount": 2,
						"fitCols": 3,
						"style": {
							"fontSize": "13px"
						}
					}
			},
		"blocks": [
			BlockGen.GenBlock(5, 1, unitWidth, unitHeight, {}, {id: 'triangleRewards_card', type: 'component', component: TriangleRewardsCard})
		]
	}
	pages.splice(pagesIndex[insertPageNum], 0, offerPage)

}
