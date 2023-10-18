/* eslint-disable no-case-declarations */

import Hammer from 'hammerjs';

/**
 * Recalculate Child x,y to match constraints of parent
 * @param pRect - Parent Rect
 * @param cRect - Child REct
 * @returns {*}
 */
const constrainRect = (pRect, cRect, align = 'center') => {

	//console.log('Constrain Rect: childRect:', Object.assign({}, cRect), '  pRect:', pRect)

	const trans = rectToJSON(cRect);

	//Constrain left scroll
	if( cRect.width < pRect.width && align == 'center'){
		const pcx = pRect.x + (pRect.width - cRect.width) / 2;
		if(cRect.x > pcx || cRect.width < pRect.width){
			trans.x +=  pcx - cRect.x;
		}
	} else {
		if(cRect.x > pRect.x || cRect.width < pRect.width){
			trans.x +=  pRect.x - cRect.x;
		}
	}



	//If the child is wider than the parent and scrolled past the right right most edge
	if(cRect.right < pRect.right && cRect.width >= pRect.width){
		trans.x += (pRect.right - cRect.right);
	}

	if(cRect.y > pRect.y || cRect.height < pRect.height){
		trans.y += pRect.y - cRect.y;
	}

	if(cRect.bottom < pRect.bottom && cRect.height >= pRect.height){
		trans.y += (pRect.bottom - cRect.bottom);
	}

	//console.log('Constrain Rect: trans:', trans)

	return trans;
}


/*const calcRectTransform = (rect, curTrans, newTrans) => {

	const mTrans = Object.assign({}, rect, curTrans, newTrans);

	const scale = (1 / curTrans.scale) * mTrans.scale; //normalize scale

	//console.log('calcRectTransform: childRect:', Object.assign({}, rect), '   scale:', scale)




	const width = rect.width * scale;
	const height = rect.height * scale;

	let x = mTrans.x;
	let y = mTrans.y;

	const ox = (width - rect.width) * ((-rect.x + mTrans.ox) / rect.width );
	const oy = (height - rect.height) *  ((-rect.y + mTrans.oy) / rect.height );
	x -= ox;
	y -= oy;

	return rectToJSON({x,y,width,height});
}*/

// eslint-disable-next-line no-unused-vars
const isEqualObj = (obj1, obj2) => {
	const allKeys = Object.assign({}, obj1, obj2);
	for(let p in allKeys){
		if(obj1[p] != obj2[p])return false;
	}
	return true;
}

/*
const compareRects = (r1, r2, cmpr = ['x', 'y', 'width', 'height']) =>{
	for(let p of cmpr){
		console.log(`compare ${p}:`, r1[p] , ' == ', r2[p]);
		if(r1[p] != r2[p]) return false;
	}

	return true;
}
*/

// eslint-disable-next-line no-unused-vars
const getRelRect = (r1, r2, scale) => {
	const rScale = 1 / scale;
	const x = (r1.x - r2.x) * rScale;
	const y = (r1.y - r2.y) * rScale;
	const width = r1.width * rScale;
	const height = r1.width * rScale;
	const top = y;
	const left = x;
	const right = x + width;
	const bottom = y + height;
	return {x, y, width, height, top, bottom, left, right};
}

const rectToJSON = (rect) => {
	const x = rect.x;
	const y = rect.y;
	const width = rect.width;
	const height = rect.height;
	const top = y;
	const left = x;
	const right = x + width;
	const bottom = y + height;

	//console.log('rectToJSON:', {x, y, width, height, top, bottom, left, right})

	return {x, y, width, height, top, bottom, left, right};
}


// eslint-disable-next-line no-unused-vars
function traceObj(o, tab = ''){
	for(let p in o){
		const val = o[p];
		console.log(tab + p + ' = ' + val);
	}
}

// eslint-disable-next-line no-unused-vars
function inertia(t, b, c, d) {
	let ts = (t /= d) * t, tc = ts * t;
	return b + c * (-1 * ts * ts + 4 * tc + -6 * ts + 4 * t);
}


// eslint-disable-next-line no-unused-vars
function easeOutCubic(t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t + 1) + b;
}


// eslint-disable-next-line no-unused-vars
function easeOutQuint (t, b, c, d) {
	t /= d;
	t--;
	return c*(t*t*t*t*t + 1) + b;
}

// eslint-disable-next-line no-unused-vars
function easeOutSine(t, b, c, d) {
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}

// eslint-disable-next-line no-unused-vars
function easeOutExpo(t, b, c, d) {
	return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
}

// eslint-disable-next-line no-unused-vars
function easeOutCirc(t, b, c, d) {
	t /= d;
	t--;
	return c * Math.sqrt(1 - t*t) + b;
}


/**
 *
 * @param t - Current Time
 * @param b - Start Value
 * @param c - Change in value
 * @param d - Duration
 * @returns {*}
 */
// eslint-disable-next-line no-unused-vars
function easeOutQuad (t, b, c, d) {
	t /= d;
	return -c * t*(t-2) + b;
}

export default class ScrollZoom{
	constructor(vue) {

		const parentDom = vue.$refs.container;
		const childDom = vue.$refs.content;

		this.vue = vue;
		this.container = parentDom;
		this.content = childDom;
		this.parentRect = rectToJSON(parentDom.getBoundingClientRect());
		this.childRect = rectToJSON(childDom.getBoundingClientRect());
		this.transAnimId = null;
		this.resizeAnimId = null;
		this.maxWidth = null;

		this.pr = 1 / window.devicePixelRatio;
		this.enabled = true;

		this.minScale = 0.125;

		this.emitChange = true;

		this.pendingEvents = {};

		this.zoom = 0;

		this.fitAxis = 'y'; //x or y

		this.align = 'center';

		this.velocity = null;

		//this.dot = document.getElementById('dot');
		this.hammer = new Hammer(vue.$refs.touchLayer);
		this.transform = {
			x: 0,
			y: 0,
			scale: 1,
			ox: 0,
			oy: 0
		}

		this.observer = new ResizeObserver(this._onResize);
		
		this.observer.observe(this.container);
		this.observer.observe(this.content);

		this.applyTransform({}, {resize:this});

		this.hammer.get('pinch').set({enable: true});
		this.hammer.get('pan').set({threshold: 0});
		//this.hammer.get('press').set({time: 0, threshold: 100});

		this.hammer.on('pinchstart panstart', this._inputStart);
		this.hammer.on('pinch pan', this._inputEvent);
		this.hammer.on('pinchend pinchcancel panend pancancel', this._inputEnd);

		vue.$refs.touchLayer.addEventListener('touchstart', () => {
			this.velocity = null;
		})

		vue.$refs.touchLayer.addEventListener('touchcancel', () => {
			if(!this.velocity){
				this.applyTransform({}, {'touchend':true})
			}
		})

		this.container.addEventListener('wheel', (e) => {

			const prevent = () => {
				e.stopPropagation();
				e.preventDefault();
				e.returnValue = false;
				return false;
			}

			this.applyTransform({'-x':e.deltaX, '-y':e.deltaY}, {'wheelScroll':e})

			if(this.getScrollY() != 0 && this.getScrollY() != this.getScrollMaxY()){
				//console.log('Prevent wheel propagation')
				return prevent();
			}

			if(this.getScrollX() != 0 && this.getScrollX() != this.getScrollMaxX()){
				//console.log('Prevent wheel propagation')
				return prevent();
			}

		}, {passive: false})

		/*this.content.addEventListener('transitionend', (e) => {
			if(e.target == this.content){
				this.childRect = rectToJSON(this.content.getBoundingClientRect());
				this.applyTransform();
				//console.log('ScrollZoom Transition End:', e)
			}

		}, {passive: true})*/

	}
	_inputStart = (e) => {

		if(!this.enabled)return;

		this.velocity = null;

		this.tempX = this.transform.x || 0;
		this.tempY = this.transform.y || 0;

		//console.log('_inputStart:', e.type, '  tempX:', this.tempX, '  tempY:', this.tempY)

		this.zStart = this.zoom;

		const trans = {};
		const emit = {'touchstart': this}

		emit[e.type] = this;

		if(e.type == 'pinchstart'){
			trans.ox = e.center.x;
			trans.oy = e.center.y;
			this.pinchScale = this.transform.scale;
		}

		this.applyTransform(trans, emit);
	}
	_inputEvent = (e) => {

		if(!this.enabled)return;
		//console.log('_inputEvent:', e.type)
		const trans = {};
		const emit = {};

		this.velocity = null;

		emit[e.type] = this;

		if(e.type == 'pinch'){
			//trans.ox = e.center.x;
			//trans.oy = e.center.y;
			this.zoom = this.zStart + (e.scale - 1) * (this.pinchScale || 1);
			emit.zoom = this;
			this.pinched = 5;
		} else if(!this.pinched) {
			trans.x = e.deltaX + this.tempX;
			trans.y = e.deltaY + this.tempY;
		} else {
			this.pinched--;
		}

		this.applyTransform(trans, emit);
	}

	_inputEnd = (e) => {
		if(!this.enabled)return;
		//console.log('_inputEnd:', e.type)
		const emit = {'touchend': this}
		emit[e.type] = this;

		if(e.overallVelocity){
			const vx = e.velocityX * 20;
			const vy = e.velocityY * 20;
			this.velocity = {
				x: vx,
				y: vy,
				tx: 0,
				ty: 0
			};
			//console.log('overallVwelocity:',e)
		}

		//console.log('Touch End:', e);

		/*const trans = {};

		trans.x = e.deltaX + this.tempX;
		trans.y = e.deltaY + this.tempY;*/

		//let ox = this.parentRect.x + this.parentRect.width/2;
		//let oy = this.parentRect.y + this.parentRect.height/2;

		this.applyTransform({}, emit);
	}

	_onResize = (entries) => {
		this.searchInputFocused = this.vue.$store.getters.isSearchInputFocused;
		if(this.searchInputFocused) {
			return;
		}
		const events = {
			resize: this
		}
		for(const entry of entries){
			if(entry.contentRect){
				if(entry.target == this.container){
					this.parentRect = rectToJSON(entry.contentRect);
					events.containerResize = this;
				} else if(entry.target == this.content) {
					this.childRect = rectToJSON(entry.contentRect);
					events.contentResize = this;
					//console.log('Content Size Change: w:', this.childRect.width, '  h:', this.childRect.height)
				}
			}
		}

		//console.log('ScrollZoom onResize');

		let ox = this.parentRect.x + this.parentRect.width/2;
		let oy = this.parentRect.y + this.parentRect.height/2;

		this.applyTransform({ox, oy}, events);
	}

	destroy(){
		if(this.transAnimId != null)cancelAnimationFrame(this.transAnimId);
		this.observer.disconnect();
		this.hammer.destroy();
	}

	moveContent(x, y){
		this.applyTransform({x, y});
	}

	scale(s){
		this.applyTransform({scale : s});
	}
	getScale(){
		return this.transform.scale;
	}

	getCurrentScale = () => {
		if(this.childRect.width > this.childRect.height){
			return  this.content.offsetWidth / this.childRect.width;
		}
		return  this.content.offsetHeight/ this.childRect.height;
	}


	getFitHeightScale(h = null){
		const height = h || this.parentRect.height;
		return  height / this.content.offsetHeight;
	}

	fitHeight(h) {
		this.scale(this.getFitHeightScale(h));
	}


	getFitWidthScale(w = null){
		const width = w || this.parentRect.width
		return width / this.content.offsetWidth;
	}

	fitWidth(w) {
		this.scale(this.getFitWidthScale(w));
	}

	setTransformOrigin(x,y){
		this.applyTransform({ox:x, oy:y});
	}

	scrollTo(x, y){
		this.applyTransform({x:-x, y:-y});
	}

	setScrollX(x) {
		this.applyTransform({x:-x});
	}

	setScrollY(y) {
		this.applyTransform({y:-y});
	}

	getScrollX(){
		return Math.floor(Math.abs(this.transform.x));
	}
	getScrollY(){
		return Math.floor(Math.abs(this.transform.y));
	}

	getScrollMaxX() {
		const w = Math.floor(this.content.offsetWidth * this.transform.scale);
		return Math.abs(Math.min(0, this.parentRect.width - w));
	}

	getContentWidth() {
		return Math.floor(this.content.offsetWidth * this.transform.scale);
	}
	getViewWidth() {
		return this.parentRect.width;
	}

	getScrollMaxY(){

		const h = Math.floor(this.content.offsetHeight * this.transform.scale);
		//console.log('getScrollMaxY:', (this.parentRect.height - h));
		//console.log('transform.scale', this.transform.scale);
		return Math.abs(Math.min(0, this.parentRect.height - h));
	}

	getContentHeight() {
		return Math.floor(this.content.offsetHeight * this.transform.scale);
	}
	getViewHeight() {
		return this.parentRect.height;
	}

	update(){
		//console.log('fitAxis:', this.fitAxis)
		this.applyTransform({}, {resize:this})
	}

	applyTransform = (transform = {}, events = {}, triggerEvents = true) => {

		//console.log('apply Transform:', transform, '  events:', events)

		if(this.transAnimId != null)cancelAnimationFrame(this.transAnimId);

		if(this.childRect.height <= 0 || this.childRect.width <= 0 || this.parentRect.height <= 0 || this.parentRect.width <= 0)return;

		const {rect: newChildRect, transform: newTransform} = this.calcRectTransform(transform)

		if(triggerEvents){
			if(newChildRect.x !== this.childRect.x || newChildRect.y !== this.childRect.y){
				this.pendingEvents.scroll = this;
			}
			if(newChildRect.width !== this.childRect.width || newChildRect.height !== this.childRect.height){
				this.pendingEvents.resize = this;
			}
			Object.assign(this.pendingEvents, events); //Force an event
		}


		Object.assign(this.childRect, newChildRect);//  this.content.getBoundingClientRect();

		Object.assign(this.transform, newTransform);


		this.transAnimId = requestAnimationFrame(() => {
			this.transAnimId = null;
			const ele = this.content;
			ele.style.transform = `translate3d(${this.transform.x}px, ${this.transform.y}px, 0px) scale(${this.transform.scale})`;
			this.vue.onChange(this, Object.assign({}, this.pendingEvents));
			this.pendingEvents = {};
			if(this.velocity){
				const ease = inertia;
				const vx = this.velocity.x;
				const vy = this.velocity.y;
				const tx = this.velocity.tx;
				const ty = this.velocity.ty;
				let trans = null;
				//const xi = this.velocity.xi;

				if(tx < Math.abs(vx)){
					const t = this.velocity.tx;
					const b = vx;
					const c = -b;
					const d = Math.abs(vx);
					this.velocity.tx += d/100;
					//console.log('Ease:', ease(t, b, c, d), `t:${t}, b:${b}, c:${c}, d:${d}`);

					if(!trans){
						trans = {};
					}
					trans['+x'] = ease(t, b, c, d);
				}

				if(ty < Math.abs(vy)){
					const t = this.velocity.ty;
					const b = vy;
					const c = -b;
					const d = Math.abs(vy);
					this.velocity.ty += d/100;
					//console.log('Ease:', ease(t, b, c, d), `t:${t}, b:${b}, c:${c}, d:${d}`);

					if(!trans){
						trans = {};
					}
					trans['+y'] = ease(t, b, c, d);
				}

				//console.log("Trans:", JSON.parse(JSON.stringify(trans)));

				if(trans && (Math.abs(trans['+x']) > 0.9 || Math.abs(trans['+y']) > 0.9)){
					this.applyTransform(trans, {'momentum':true})
				} else {
					this.velocity = null;
					this.applyTransform({}, {'touchend':true})
				}
			}
			//console.log(JSON.parse(JSON.stringify(this.transform)) )
		})
	}

	applyTransformDelta = (delta) => {
		const o = {};
		let prop;
		for(let p in delta){
			switch (p.charAt(0)) {
				case '-':
					prop = p.slice(1);
					o[prop] = this.transform[prop] - delta[p];
				break;
				case '+':
					prop = p.slice(1);
					o[prop] = this.transform[prop] + delta[p];
				break;
				case '*':
					prop = p.slice(1);
					o[prop] = this.transform[prop] * delta[p];
				break;
				default:
					o[p] = delta[p];
			}

		}
		return o;
	}

	getChildSize = () => {
		return {
			width: this.content.offsetWidth,
			height: this.content.offsetHeight
		}
	}


	calcRectTransform = (transform) => {

		const rect = rectToJSON(this.childRect);

		//console.log('calcRecTransform:', transform, '  child rect:', rect);

		const mTrans = Object.assign({}, rect, this.transform, this.applyTransformDelta(transform));

		//const cRect = this.content.getBoundingClientRect();

		//console.log('mTrans:', mTrans)



		//Check for fitted scale
		if(this.fitAxis) {
			const maxW = this.maxWidth? Math.min(this.parentRect.width, this.maxWidth): null;
			const fitScale = this.fitAxis === 'y'? this.getFitHeightScale(): this.getFitWidthScale(maxW);
			mTrans.scale = fitScale + (fitScale * this.zoom);
		}

		//Check for scale limits
		if(mTrans.scale < this.minScale)mTrans.scale = this.minScale; //Constrain Scale
		if(this.maxScale && mTrans.scale > this.maxScale)mTrans.scale = this.maxScale;



		const scale = this.getCurrentScale() * mTrans.scale; //normalize scale
		const diffScale = mTrans.scale - this.transform.scale;

		const width = rect.width * scale;
		const height = rect.height * scale;

		let x = mTrans.x;
		let y = mTrans.y;

		//console.log('diffScale:', diffScale)

		if(x && diffScale) {
			const ox = (width - rect.width) * ((-rect.x + mTrans.ox) / rect.width);
			x -= ox;
		}

		if(y && diffScale){
			const oy = (height - rect.height) *  ((-rect.y + mTrans.oy) / rect.height );
			y -= oy;
		}

		/*if(this.transform.y){

		}*/

		//console.log(`x: ${x}, y: ${y}`);


		const nRect = roundRect(constrainRect(this.parentRect, rectToJSON({x,y,width,height}), this.align));
		//console.log('nRect:', nRect);

		roundRect(mTrans);

		return {rect:nRect, transform: { x:nRect.x, y:nRect.y, scale:mTrans.scale, ox:mTrans.ox, oy:mTrans.oy}};
	}

}

const roundRect = (rect) => {
	const props = ['x','y','width','height', 'top','bottom', 'ox', 'oy'];
	for(let i=0 ; i < props.length; i++){
		const p = props[i];
		if(!isNaN(rect[p])){
			//rect[p] = Math.ceil(rect[p]);
		}
	}
	return rect;
}
