/* eslint-disable */
import VueRouter from 'vue-router'
import MyAbout from '../pages/MyAbout.vue'
import MyHome from '../pages/MyHome.vue'
import MyMessage from '../pages/MyMessage.vue'
import MyNews from '../pages/MyNews.vue'
import MyDetail from '../pages/MyDetail.vue'
const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/about',
            component: MyAbout,
            meta: { title: '关于' }
        },
        {
            path: '/home',
            component: MyHome,
            meta: { title: '首页' },
            children: [
                {
                    path: 'message',
                    component: MyMessage,
                    meta: { title: '信息' },
                    children: [
                        {
                            // path: 'detail',
                            name: 'detail',
                            path: 'detail/:id/:msg',
                            component: MyDetail,
                            meta: { title: '详情' },
                            props: true,
                        }
                    ]
                },
                {
                    path: 'news',
                    component: MyNews,
                    meta: { title: '新闻', isAuth: true },
                },
            ]
        },
    ]
})
router.beforeEach((to, from, next) => {
    if (to.meta.isAuth) {
        if (localStorage.getItem('name') === 'abc') {
            next();
        } else alert('禁止访问');
    } else next();
})
router.afterEach((to, _) => {
    document.title = to.meta.title || 'default';
})
export default router;
