import VueRouter from 'vue-router'
import MyAbout from '../pages/MyAbout.vue'
import MyHome from '../pages/MyHome.vue'
import MyMessage from '../pages/MyMessage.vue'
import MyNews from '../pages/MyNews.vue'
import MyDetail from '../pages/MyDetail.vue'
export default new VueRouter({
    routes: [
        {
            path: '/about',
            component: MyAbout
        },
        {
            path: '/home',
            component: MyHome,
            children: [
                {
                    path: 'message',
                    component: MyMessage,
                    children: [
                        {
                            // path: 'detail',
                            name: 'detail',
                            path: 'detail/:id/:msg',
                            component: MyDetail,
                            // props: true,
                        }
                    ]
                },
                {
                    path: 'news',
                    component: MyNews,
                },
            ]
        },
    ]
})