import Vue from 'vue' //引入Vue包
import App from './App.vue' //引入App组件（所有组件的父组件）
Vue.config.productionTip = false //关闭生产提示
new Vue({ //创建Vue实例对象vm
    render: h => h(App), //将App组件放入容器中
}).$mount('#app') //指定容器，也可以直接写到vm配置项el中