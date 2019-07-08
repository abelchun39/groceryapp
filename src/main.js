import Vue from 'vue'
import router from './router/router.js';
import App from './App.vue'

import {
  Input,
  Select,
  Option,
  Row,
  Col,
  Card,
  Button,
  Icon
} from 'element-ui';
import 'element-ui/lib/theme-default/index.css'

Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Button)
Vue.use(Icon)

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
})
