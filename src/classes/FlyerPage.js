
export default class FlyerPage {
	page = {};
	constructor(page) {
		this.page = page;
	}

	/**
	 *
	 * @returns number
	 */
	get unitWidth(){
		return this.page.unitWidth;
	}

	/**
	 *
	 * @returns number
	 */
	get unitHeight(){
		return this.page.unitHeight;
	}

	get grids(){
		return this.page.grids;
	}

	/**
	 * Get unit width of page in current mode
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @param {int | null} cols - use custom columns to calculate the value. Null use inherited columns values
	 * @return number
	 */
	getPageWidth(mode, cols = null) {
		const uw = this.unitWidth;
		const grid = this.grids[mode];
		if(grid) {
			return (cols || grid.colCount) * uw;
		}
		return 0;
	}

	/**
	 * Get unit height of page in current mode
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @param rows - use custom rows to calculate the value. Null use inherited rows values
	 * @return number
	 */
	getPageHeight(mode, rows = null){
		const uh = this.unitHeight;
		const grid = this.grids[mode];
		if(grid){
			return (rows || grid.rowCount) * uh;
		}
		return 0;
	}

	/**
	 *
	 * @param {int} fCols
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {number}
	 */
	getFitUnitWidth(fCols, mode) {
		const f = this.getPageWidth(mode) / this.getPageWidth(mode, fCols);
		return this.unitWidth * f;
	}

	/**
	 *
	 * @param {int} fRows
	 * @param  {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {number}
	 */
	getFitUnitHeight(fRows, mode){
		const f = this.getPageHeight(mode) / this.getPageHeight(mode, fRows);
		return this.unitHeight * f;
	}

	/**
	 *
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {number}
	 */
	getModeUnitWidth(mode) {
		const grid = this.grids[mode];
		if(grid && grid['fitCols']) {
			return this.getFitUnitWidth(grid['fitCols'], mode);
		}
		return this.unitWidth;
	}

	/**
	 *
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {number}
	 */
	getModeUnitHeight(mode) {
		const grid = this.grids[mode];
		if(grid) {
			if(grid['fitRows']){
				return this.getFitUnitHeight(grid['fitRows'], mode);
			}
			if(grid['fitCols']){
				return this.unitHeight * (this.getModeUnitWidth(mode) / this.unitWidth);
			}
		}
		return this.unitHeight;
	}

	/**
	 *
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {int}
	 */
	getModeCols(mode) {
		const grid = this.grids[mode];
		return grid['fitCols'] || grid.colCount;
	}

	/**
	 *
	 * @param {('desktop' | 'tablet' | 'mobile')} mode
	 * @returns {int}
	 */
	getModeRows(mode) {
		const grid = this.grids[mode];
		return grid['fitRows'] || grid.rowCount;
	}

}
