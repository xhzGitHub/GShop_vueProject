<template>
  <div id="app">
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.showFooter
"></FooterGuide>
  </div>
</template>

<script>

import FooterGuide from './components/FooterGuide/FooterGuide'
import {reqFoodCategorys} from "./api"
import {mapActions} from 'vuex'

export default {
  name: 'App',
  mounted(){
    this.$store.dispatch('getAddress')    // 写法一
    // this.getAddress();   // 写法二
  },
  methods: {
    // ...mapActions(['getAddress'])
  },
  components: {
    FooterGuide
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
