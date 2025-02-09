import VueRouter from 'vue-router'
import MyAbout from '../pages/MyAbout.vue'
import MyHome from '../pages/MyHome.vue'

export default new VueRouter({
    routes: [
        {
            path: '/about',
            component: MyAbout
        },
        {
            path: '/home',
            component: MyHome
        },
    ]
})