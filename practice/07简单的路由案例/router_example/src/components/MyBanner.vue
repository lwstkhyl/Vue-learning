<template>
    <div class="col-xs-offset-2 col-xs-8">
        <div class="page-header">
            <h2>Vue Router Demo</h2>
            <button @click="forward">前进</button>
            <button @click="back">后退</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "MyBanner",
    methods: {
        forward(){
            this.$router.forward();
        },
        back(){
            this.$router.back();
        },
    },
}
</script>

<style>

</style>