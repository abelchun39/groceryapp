import Vue from 'vue';
import VueRouter from 'vue-router';

import IndexPage from '../pages/IndexPage.vue';
import EditProductPage from '../pages/EditProductPage.vue';
import NotFound from '../pages/404.vue';
import VueSwal from 'vue-swal'
 
Vue.use(VueSwal)
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: IndexPage },
    { path: '/edit/product/:id', component: EditProductPage },
    { path: '*', component: NotFound }
  ]
});

export default router;
