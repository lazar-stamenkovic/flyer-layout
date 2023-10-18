<template>
	<div v-if="ready" v-click-outside="closeTour" :style="position" class="tour-window">
		<div>
			<div :style="arrowPos" class="arrow"></div>
			<div class="tour-window-root">
				<div class="heading">
					<div class="item-name">{{ tourData.title }}</div>
					<div class="progress">{{ `${index + 1} ${content.of} ${totalItems}` }}</div>
				</div>
				<div class="content">{{ tourData.text }}</div>
				<div class="buttons">
					<button :aria-label="skipCaption" class="fancy  skip-button" @click="skip">{{ skipCaption }}</button>
					<button :aria-label="nextCaption" class="fancy green" @click="next">{{ nextCaption }}</button>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import ClickOutside from 'vue-click-outside'
import AppConfig from "@/classes/AppConfig";

function calcDist(p1, p2) {
	return Math.sqrt((p2.x - p1.x) ^ 2 + (p2.y - p1.y) ^ 2);
}

export default {
	name: "TourWindow",
	data() {
		return {
			items: [],
			index: 0,
			position: null,
			arrowPos: null,
			padding: 10,
			subHeaderState: null,
			ready: false,
			filteredItems: []
		}
	},
	directives: {
		ClickOutside
	},
	computed: {
		...mapGetters(['content', 'highlightResults']),
		...mapGetters('filters', ['isFilterPanelOpen']),
		tourOrder() {
			return [
				'sidebar',
				'fullscreen',
				'searchFilter',
				this.highlightResults ? null : 'search',
				'filterCategories',
				'discountFilter',
				'clearDiscount',
				'exitSearch',
				'zoom',
				'orientation',
				'pdf',
				'otherFlyers',
				'shoppingList',
				'help',
			].filter(item => item !== null);
		},
		isVisible() {
			return this.ready;
		},
		tourData() {
			return this.content.walkthrough[this.tourId] || {};
		},
		tourId() {
			return this.filteredItems[this.index];
		},
		nextCaption() {
			if (this.isLastItem) return this.content.finish;
			return this.content.next;
		},
		skipCaption() {
			if (this.isLastItem) return this.content.restart;
			return this.content.skipTour;
		},
		isLastItem() {
			return this.index == (this.totalItems - 1)
		},
		totalItems() {
			return this.filteredItems.length;
		}
	},
	mounted() {
		this.subHeaderState = this.isFilterPanelOpen;
		if(AppConfig.AppConf?.title.toLowerCase().includes("ct".toLowerCase()))
				this.setFilterPanelState(true);
		this.$nextTick(() => {
				setTimeout(() => {
					const ti = document.querySelectorAll("[data-tour-item]");
				/*	console.log('Tour Items:', ti)*/
					if (ti.length < 1) {
						this.dismissTour();
						return;
					}
					this.items = [];
					ti.forEach((node) => {
						this.items.push({
							node,
							item: node.getAttribute('data-tour-item'),
							rect: node.getBoundingClientRect(),
							dist: calcDist({x: 0, y: 0}, node.getBoundingClientRect())
						})
						//this.items.push(node.getAttribute('data-tour-item'))
					})

					// console.log('Items Rects:', this.items);

					this.filteredItems = this.items.filter((item) => {
						return item.rect.width && item.rect.height && this.content.walkthrough[item.item];
					}).sort((a, b) => {
						return a.rect.left - b.rect.left;
					}).map((item) => {
						return item.item;
					})

					// console.log('Filtered Tour Items:', this.filteredItems);

					/*this.filteredItems = this.tourOrder.filter((item) => {
						return this.items.includes(item);
					})*/


					this.refresh();
					this.observer = new ResizeObserver(this.refresh);
					this.observer.observe(document.querySelector('#app'));
					this.ready = true;
				}, 100);

			}
		)
	},

	beforeDestroy() {
		this.setFilterPanelState(this.subHeaderState);
		if (this.observer) this.observer.disconnect();
	},

	methods: {
		...mapActions('toast', ['dismissTour']),
		...mapActions('filters', ['setFilterPanelState']),
		refresh() {
			// if(window.innerWidth < 1200){
			if (window.innerWidth < 1023) {
				this.dismissTour();
				return;
			}
			const tourWindow = document.querySelector('.tour-window');
			if (!tourWindow) return;
			const item = document.querySelector(`[data-tour-item='${this.tourId}']`);
			const container = document.querySelector('#app').getBoundingClientRect();
			let pos = null;
			let arrowPos = null
			if (item) {

				const bounds = item.getBoundingClientRect();
				const wb = tourWindow.getBoundingClientRect();
				let targetMid = bounds.left + (bounds.width / 2);

				let left = bounds.left - (wb.width - bounds.width) / 2;
				let bottom = bounds.bottom + this.padding;

				if (left < container.left) {
					left = container.left + this.padding;
				}

				if (left + wb.width > container.right) {
					left = (container.right - wb.width) - this.padding;
				}

				pos = {
					top: bottom + 'px',
					left: left + 'px'
				}

				arrowPos = {
					left: 'calc(50% + ' + (targetMid - (left + wb.width / 2)) + 'px)'
				}

			}
			this.position = pos;
			this.arrowPos = arrowPos;
		},
		next() {
			if (this.isLastItem) {
				this.dismissTour(true);
			} else {
				if (this.index < this.items.length - 1) this.index++;
				this.refresh()
			}
		},
		prev() {
			if (this.index > 0) this.index--;
			this.refresh();
		},
		skip() {
			if (!this.isLastItem) {
				this.dismissTour(true);
			} else {
				this.index = 0;
				this.refresh();
			}

		},
		closeTour() {
			console.log('closeTour')
			this.dismissTour(true);
		}
	}
}
</script>
<style lang="scss" scoped>
.tour-window {
  position: absolute;
  z-index: 1000;
  font-size: 12px;
  width: 300px;
  transition: All 300ms;

  * {
	transition: All 300ms;
  }

  filter: drop-shadow(2px 2px 3px #000);

  .tour-window-root {
	border-radius: 4px;
	overflow: hidden;
	background-color: #fff;

	.heading {
	  display: flex;
	  justify-content: space-between;
	  background-color: var(--secondary-color);
	  color: var(--primary-text-color);
	  border-bottom: 1px solid #eee;
	  margin: 0px;
	  padding: 5px 10px;

	  .item-name {
		font-weight: bold;
	  }
	}

	.content {
	  padding: 1em;
	}

	.buttons {
	  padding: 0px 1em 1em;
	  display: flex;
	  gap: 0.5em;
	  justify-content: flex-end;
	}

	.skip-button {
	  background-color: #EE3124;
	  color: white;
	}
  }

  .arrow {
	position: absolute;
	transform: translate(-50%, -50%) rotateZ(45deg);
	width: 12px;
	height: 12px;
	background-color: var(--secondary-color);
	top: 0px;
	z-index: -1;
  }
}

// @media (max-width: 1023px) {
//      .tour-window {
//       display: none;
//     }
// }

</style>
