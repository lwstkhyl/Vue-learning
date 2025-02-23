<template>
    <el-dialog
        title="用户登录"
        :visible.sync="visible"
        width="400px"
        :show-close="false"
    >
        <el-form ref="form" :model="form" @submit.native.prevent="handleLogin">
        <el-form-item>
            <el-input
                v-model="form.username"
                placeholder="用户名"
                prefix-icon="el-icon-user"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-input
                v-model="form.password"
                type="password"
                placeholder="密码"
                prefix-icon="el-icon-lock"
                show-password
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
                type="primary"
                native-type="submit"
                :loading="loading"
                style="width: 100%"
            >登录</el-button>
        </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
import { encryptPassword } from '@/utils/crypto'
import request from '../api/request';
export default {
    data() {
        return {
            visible: false,
            loading: false,
            form: {
                username: '',
                password: ''
            }
        }
    },
    methods: {
        ...mapMutations('auth', ['SET_TOKEN', ]),
        show() {
            this.visible = true;
        },
        async handleLogin() {
            if(!(this.form.username && this.form.password)) return this.$message.error('输入不能为空');
            try {
                this.loading = true;
                const res = await request.post('/auth/login', {
                    username: this.form.username,
                    password: encryptPassword(this.form.password) // 前端加密
                });
                this.SET_TOKEN(res.data.token);
                this.$router.push('/file');
                // window.location.reload(); // 强制刷新页面
                this.visible = false;
            } catch (err) {
                this.$message.error('登录失败');
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
/* 页面居中 */
::v-deep .el-dialog{
    display: flex;
    flex-direction: column;
    margin:0 !important;
    position:absolute;
    top:50%;
    left:50%;
    transform:translate(-50%,-50%);
    max-height:calc(100% - 30px);
    max-width:calc(100% - 30px);
}
::v-deep  .el-dialog .el-dialog__body{
    flex:1;
    overflow: auto;
}
</style>