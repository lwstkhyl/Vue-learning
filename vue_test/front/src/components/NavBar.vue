<template>
    <div class="nav-bar">
        <div class="auth-buttons">
        <el-button v-if="!isLoggedIn" class="el-button el-button--primary" @click="login">登录</el-button>
        <el-button v-else @click="logout">退出</el-button>
        </div>
    </div>
</template>

<script>
export default {
    props:["isLoggedIn"],
    methods: {
        login() {
            this.$router.push('/login');
        },
        async logout() {
            this.$store.commit('LOGOUT');
            this.$router.push('/login');
        }
    }
}
</script>
