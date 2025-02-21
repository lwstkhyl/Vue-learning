<template>
  <div id="app">
    <!-- <router-link :to="{
        path:'/file',
        query:{
          isLoggedIn,
        }
      }">file</router-link> -->
    <router-link to="/file">file</router-link>
    <nav-bar/>
    <br>
    <keep-alive include="file">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';

export default {
  name: 'App',
  components: { NavBar, },
  computed:{
    ...mapState('auth', {isLoggedIn: 'token'}),
  }
}
</script>

<style>
/* 解决控制台多选框报错 */
input[aria-hidden="true"] {
    display: none !important;
}
</style>
