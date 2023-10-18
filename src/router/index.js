import Vue from 'vue'
import VueRouter from 'vue-router'
import App from "../App.vue";
//import AppWrapper from "@/AppWrapper";
// import LandingPage from "../views/LandingPage.vue";
import ErrorPage from "@/views/ErrorPage";

/*function hasQueryParams(route) {
	return !!Object.keys(route.query).length;
}*/

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Flyer',
		props: true,
		component: App,
		/*beforeEnter(to, from, next) {
			if (!hasQueryParams(to)) {
				next({...to, query: from.query});
			} else {
				next();
			}
		}*/
	},
	{
		path: '/flyer/:flyerId',
		name: 'DefaultFlyer',
		props: true,
		component: App
	},

	{
		path: '/error/:type',
		name: 'ErrorPage',
		props: true,
		component: ErrorPage
	},

]

const router = new VueRouter({
	mode: "history",
	routes
})

export default router
