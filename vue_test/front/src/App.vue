<template>
  <div id="app">
    <router-link to="/login">login</router-link>
    <br>
    <br>
    <router-link to="/file">file</router-link>
    <br>
    <br>
    <br>
    <br>
    <br>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>

</style>
