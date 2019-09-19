import Vue from "vue";
import Router from "vue-router";
// import routes from "./views"
import routes from "./tmp"

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});
