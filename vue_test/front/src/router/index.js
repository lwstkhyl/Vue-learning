import VueRouter from 'vue-router'
import Vue from 'vue'
Vue.use(VueRouter);
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
import MyLogin from '../views/MyLogin.vue'
import MyMain from '../views/MyMain.vue'
export default new VueRouter({
    routes: [
        {
            path: '/login',
            component: MyLogin
        },
        {
            path: '/file',
            component: MyMain,
            props: route => ({
                currentPath: route.query.path || ''
            })
        },
    ]
})