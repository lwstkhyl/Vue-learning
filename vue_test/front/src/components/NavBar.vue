<template>
    <div class="nav-bar">
        <div class="auth-buttons">
            <template v-if="!isLoggedIn">
                <el-button type="primary" @click="showLogin">登录</el-button>
            </template>
            <template v-else>
                <el-button type="danger" @click="logout()">退出登录</el-button>
            </template>
        </div>
        <!-- 添加登录弹窗组件 -->
        <login-modal ref="loginModal" />
    </div>
</template>

<script>
import LoginModal from './LoginModal.vue'
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';

export default {
    components: { LoginModal },
    computed:{
        ...mapState('auth', {isLoggedIn: 'token'}),
    },
    methods: {
        ...mapMutations('auth', ['LOGOUT', ]),
        showLogin() {
            this.$refs.loginModal.show()
        },
        async logout() {
            this.LOGOUT();
            // window.location.reload();
        }
    }
}
</script>
