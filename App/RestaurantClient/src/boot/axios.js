import axios from 'axios'
const axiosInstance = axios.create({

})
export default ({ Vue }) => {
  Vue.prototype.$axios = axios
}
export { axiosInstance }
