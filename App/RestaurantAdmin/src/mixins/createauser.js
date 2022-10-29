import { mapActions } from 'vuex'
export default {
  methods: {
    ...mapActions('order', ['createAUser', 'modifyAUser'])
  }
}
