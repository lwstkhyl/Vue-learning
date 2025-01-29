<template>
<div>
    <img src="./assets/logo.png" alt="logo">
    <MyStudent/>
</div>
</template>
<script>
    import MyStudent from './components/MyStudent.vue';
    export default {
        name:"App",
        components:{
            MyStudent
        }
    }
</script>