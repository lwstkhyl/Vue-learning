<template>
  <div id="app">
        <div class="row">
            <MyBanner/>
        </div>
        <div class="row">
            <div class="col-xs-2 col-xs-offset-2">
                <div class="list-group">
                    <router-link class="list-group-item" active-class="active" to="/about">About</router-link>
                    <!-- <router-link replace class="list-group-item" active-class="active" to="/about">About</router-link> -->
                    <router-link class="list-group-item" active-class="active" to="/home">Home</router-link>
                    <!-- <router-link replace class="list-group-item" active-class="active" to="/home">Home</router-link> -->
                </div>
            </div>
            <div class="col-xs-6">
                <div class="panel">
                    <div class="panel-body">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>

<script>
import MyBanner from './components/MyBanner.vue'
export default {
  name: 'App',
  components: {MyBanner}
}
</script>

