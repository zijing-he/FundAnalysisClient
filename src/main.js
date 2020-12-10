// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import * as echarts from 'echarts'
import fundTool from '@/tools/fund_tool'

Vue.config.productionTip = false

Vue.prototype.$remoteIP = 'http://10.76.0.165:5000/'
Vue.prototype.$http = axios
Vue.prototype.$chart = echarts
Vue.prototype.$fundTool = fundTool

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: {App},
    template: '<App/>'
})
