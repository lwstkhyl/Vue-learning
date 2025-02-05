<template>
	<section class="jumbotron">
		<h3 class="jumbotron-heading">Search Github Users</h3>
		<div>
			<input type="text" placeholder="enter the name you search" v-model="keyWord"/>&nbsp;<button @click="getUsers">Search</button>
		</div>
	</section>
</template>

<script>
import axios from 'axios'
export default {
	name: 'MySearch',
	data() {
		return {
			keyWord: ''
		}
	},
	methods: {
		getUsers(){
			if(!this.keyWord.trim()) {
				this.keyWord = '';
				return alert("输入不能为空");
			}
			this.$bus.$emit('getUsers', {isFirst: false, isLoading: true, users: [], errMsg: ''}); //发送请求、未得到数据（data设为空是为了清空上一次的搜索数据）
			axios.get(`https://api.github.com/search/users?q=${this.keyWord}`)
				.then(value => {
					const res = value.data.items.map(user => {
						return { //提取需要的变量
							login: user.login,
							avatar_url: user.avatar_url,
							html_url: user.html_url,
							id: user.id
						};
					}); //将数据保存到变量中
					if(res.length === 0){ //查询没有结果
						return this.$bus.$emit('getUsers', {isLoading: false, users: [], errMsg: '未查询到符合条件的结果'});
					}
					this.$bus.$emit('getUsers', {isLoading: false, users: res, errMsg: ''}); //发送请求、响应成功
				}, reason => {
					this.$bus.$emit('getUsers', {isLoading: false, errMsg: reason.message, users: []}); //发送请求、响应错误
				});
		}
	},
}
</script>
