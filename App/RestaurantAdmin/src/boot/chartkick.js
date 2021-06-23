import Vue from 'vue'
import Chartkick from 'vue-chartkick'
import * as Charts from 'chart.js/dist/chart'
console.log({ Chartkick })
console.log({ Charts })
Vue.use(Chartkick.use(Charts))
