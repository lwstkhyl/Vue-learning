/* eslint-disable */
<template>
  <div class="login-container">
    <el-form @submit.native.prevent="login">
      <h2>网盘登录</h2>
      <el-input v-model="form.username" placeholder="用户名"></el-input>
      <el-input 
        v-model="form.password" 
        type="password" 
        placeholder="密码"
        show-password
      ></el-input>
      <el-button type="primary" native-type="submit">登录</el-button>
    </el-form>
  </div>
</template>

<script>
import request from '../api/request';
import { encryptPassword } from '../utils/crypto';

export default {
  name:'MyLogin',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      try {
        const res = await request.post('/auth/login', {
          username: this.form.username,
          password: encryptPassword(this.form.password) // 前端加密
        });
        
        this.$store.commit('SET_TOKEN', res.data.token);
        this.$router.push('/file');
      } catch (err) {
        this.$message.error('登录失败');
      }
    }
  }
}
</script>
