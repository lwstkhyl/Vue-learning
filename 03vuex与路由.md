<a id="mulu">目录</a>
<a href="#mulu" class="back">回到目录</a>
<style>
    .back{width:40px;height:40px;display:inline-block;line-height:20px;font-size:20px;background-color:lightyellow;position: fixed;bottom:50px;right:50px;z-index:999;border:2px solid pink;opacity:0.3;transition:all 0.3s;color:green;}
    .back:hover{color:red;opacity:1}
    img{vertical-align:bottom;}
</style>

<!-- @import "[TOC]" {cmd="toc" depthFrom=3 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [Vuex](#vuex)
    - [简介](#简介)
    - [基本使用](#基本使用)
    - [getters](#getters)
    - [map系列函数](#map系列函数)
    - [模块化](#模块化)

<!-- /code_chunk_output -->

<!-- 打开侧边预览：f1->Markdown Preview Enhanced: open...
只有打开侧边预览时保存才自动更新目录 -->

写在前面：此笔记来自b站课程[尚硅谷Vue2.0+Vue3.0全套教程](https://www.bilibili.com/video/BV1Zy4y1K7SH) / [资料下载](https://www.aliyundrive.com/s/B8sDe5u56BU/folder/61138e6e8582eecbe4c84546a1b2d58363d20bc0)

### Vuex
##### 简介
专门在Vue中实现集中式状态（数据）管理的**Vue插件**，对Vue应用中多个组件的共享状态进行集中式的管理（读/写），也是一种组件间通信的方式，且适用于任意组件间通信
**多个组件需要共享数据：通过全局事件总线和vuex**
![Vuex简介1](./md-image/Vuex简介1.png){:width=500 height=500}
![Vuex简介2](./md-image/Vuex简介2.png){:width=500 height=500}
**什么时候用Vuex**：共享状态
- 多个组件依赖于同一状态（数据）
- 来自不同组件的行为需要变更同一状态（简单来说就是多个组件都想修改同个数据）

---

**工作原理**：
![Vuex简介4](./md-image/Vuex简介4.png){:width=400 height=400}
- Vuex由3个部分组成，是绿框里面的`actions`/`mutations`/`state`
  - state对象中存储着数据
  - actions对象中存储一些操作数据的函数方法，格式：`{方法名:function(){}}`
  - mutations对象的格式与actions相同，不同的是，mutations里面的函数可以获得state中存储的数据和传来的新数据
- **具体过程**：
  - `Vue components`指组件，组件可以调用`dispatch(方法, 数据)`这个API来调用actions中的方法改变数据
  - actions中的方法内部调用`commit(方法, 数据)`
  - 数据传给mutations进行最终的修改，保存在state中
  - 重新渲染组件
- **actions的作用（为什么要有dispatch和commit，而不是直接传到mutations中）**：因为有时传给mutations的数据是由后端指定的，在修改前，需要先向后端发送请求获得数据，actions正是发送Ajax请求的地方。除此之外，如果想进行数据的判断/预加工，也是写在这里
  - vuex也提供了在`Vue components`中直接调用commit的功能，适用于不用发送请求、不用额外判断的情况
- 一个比喻：`Vue components`-来吃饭的客人，`store`-饭店、`actions`-服务员，`mutations`-后厨，`state`-做出来的菜
- 图中没有体现的是，Vuex这几个部分都由一个`store`统一管理
##### 基本使用
- 安装：vuex的3.x.x版本适用于Vue2，4.x.x版本适用于Vue3
  - 这里因为是Vue2，所以`npm i vuex@3`
- 在`src`文件夹下创建一个`store`文件夹，里面创建一个`index.js`，用于创建vuex中的store
    ```js
    import vuex from 'vuex'; //引入vuex
    import Vue from 'vue'; //引入vue
    Vue.use(vuex); //使用插件
    const actions = { //actions--用于响应组件中的动作
        方法名(context, value){ //context是上下文对象，value是组件调用时传来的数据
            context.state.数据名 //处理函数
            context.commit(mutations方法名, value); //调用commit
        },
    };
    const mutations = { //mutations--用于操作数据
        方法名(state, value){ //state是存储数据的那个state对象，value就是commit传来的值
            state.数据名 //处理函数
    };
    const state = {
        要存储的数据名: 值,
    }; //state--用于存储数据
    export default new vuex.Store({ //创建并暴露store
        actions,
        mutations,
        state
    });
    ```
    在开发中，actions中的方法名常小写，mutations中大写
- 在`main.js`中引入
    ```js
    import store from './store'; //引入store
    new Vue({
        render: h => h(App),
        store //使用store创建vm
    }).$mount('#app')
    ```
    注意：es6中会无视书写顺序，优先执行import，之后再执行其它语句。而`store/index.js`中`new vuex.Store`需要先执行`Vue.use(vuex)`，如果把它写到`main.js`中就会先执行`import store/index.js`，报错所以要在`store/index.js`中先使用vuex插件
- 在组件中使用
    ```js
    vc.$store.state.数据名 //读取vuex中的数据
    vc.$store.dispatch('action中的方法名', 数据); //调用dispatch修改vuex中的数据
    vc.$store.commit('mutations中的方法名', 数据); //调用commit修改vuex中的数据
    ```

例：下拉框选择每次加减的数量，点击`+`加，点击`-`减，`当前和为奇数再加`先判断当前求和是否为奇数，`等一等再加`延时0.5s再加
![Vuex简介3](./md-image/Vuex简介3.png){:width=100 height=100}
- 普通Vue：
    ```html
    <div>
        <h1>当前求和为：{{count}}</h1>
        <select v-model.number="num">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
    <script>
    export default {
        name: "MyCount",
        data() {
            return {
                count: 0,
                num: 1
            }
        },
        methods: {
            increment(){
                this.count += this.num;
            },
            decrement(){
                this.count -= this.num;
            },
            incrementOdd(){
                if(this.count%2){
                    this.count += this.num;
                }
            },
            incrementWait(){
                setTimeout(()=>{
                    this.count += this.num;
                }, 500);
            }
        },
    }
    </script>
    ```
    需要注意的是，下拉框要确保里面的是数字型，可以在每个option标签内的value前加冒号`:value="1"`，也可以在select标签内`v-model.number="num"`
- vuex：把`count`存到state中，`increment`系列的处理需要在actions中判断奇数和写延时器，`decrement`直接调commit（因为没有Ajax和判断）
    ```html
    <!-- MyCount.vue -->
    <div>
        <h1>当前求和为：{{$store.state.count}}</h1>
        <select v-model.number="num">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
        </select>
        <button @click="increment">+</button>
        <button @click="decrement">-</button>
        <button @click="incrementOdd">当前和为奇数再加</button>
        <button @click="incrementWait">等一等再加</button>
    </div>
    <script>
    export default {
        name: "MyCount",
        data() {
            return {
                num: 1
            }
        },
        methods: {
            increment(){
                this.$store.commit('ADD', this.num);
            },
            decrement(){
                this.$store.commit('MINUS', this.num);
            },
            incrementOdd(){
                this.$store.dispatch('addOdd', this.num);
            },
            incrementWait(){
                this.$store.dispatch('addWait', this.num);
            }
        },
    }
    </script>
    ```
    ```js
    /* index.js */
    import vuex from 'vuex';
    import Vue from 'vue';
    Vue.use(vuex);
    const actions = {
        addOdd(context, value) {
            if (context.state.count % 2) {
                context.commit('ADD', value);
            }
        },
        addWait(context, value) {
            setTimeout(() => {
                context.commit('ADD', value);
            }, 500);
        },
    };
    const mutations = {
        ADD(state, value) {
            state.count += value;
        },
        MINUS(state, value) {
            state.count -= value;
        }
    };
    const state = {
        count: 0
    };
    export default new vuex.Store({ actions, mutations, state });
    ```

---

**vuex开发者工具**：集成在Vue devtools中，无需额外安装
![Vuex简介5](./md-image/Vuex简介5.png){:width=250 height=250}
- 展示的状态改变都是mutations中的，而不是actions

![Vuex简介6](./md-image/Vuex简介6.png){:width=100 height=100}
**三个按钮**：
- 第一个：将该次方法调用及其之前的方法调用合并，合并到BaseState中（将BaseState变成执行完该次方法调用后的样子），同时隐藏这些合并完的方法
- 第二个：取消该次方法执行（撤销），如果撤销的不是最后一次方法，则它之后的方法也会被撤销
- 第三个：回到该次方法被调用时的数据和页面

![Vuex简介7](./md-image/Vuex简介7.png){:width=100 height=100}
**右上角的三个按钮**：
- 第一个：合并所有方法调用
- 第二个：清空所有方法调用
- 第三个：停止监视活动（通常不用）

![Vuex简介8](./md-image/Vuex简介8.png){:width=100 height=100}
**导入和导出按钮**：点击导出后会复制到剪贴版上，点击导入后粘贴即可

---

**补充说明**：
- **为什么要有上下文对象`context`**：除了便于调用commit和state，还可以调用actions中的其它方法`context.dispatch()`，适用于处理逻辑复杂时进行拆分和复用
- **为什么不在actions中直接修改数据**：虽然可以实现逻辑，但因为开发者工具只检测mutations，还是写到mutations中更标准
- **为什么要在actions中写判断逻辑**：当判断逻辑复杂时，可能需要拆分复用
##### getters
类似于Vue中的计算属性，写法类似于mutations和actions，也是写在`index.js`中，不是必需的，当处理逻辑复杂时使用
```js
/* index.js */
const getters = {
    计算属性名(state){ 
        return state.属性 //处理函数
    }
}
export default new vuex.Store({ actions, mutations, state, getters });
/* 组件.vue */
vc.$store.getters.计算属性名
```
例：在上面的案例中，创建一个标签，内容为`count*10`
```js
/* index.js */
const getters = {
    bigSum(state) {
        return state.count * 10;
    }
}
export default new vuex.Store({ actions, mutations, state, getters });
```
```html
<!-- MyCount.vue -->
<h2>当前求和*10为：{{$store.getters.bigSum}}</h2>
```
##### map系列函数
解决每次在组件中调用state/actions/mutations时都要写`this.$store`的问题
需要先在组件中引入这些函数
```js
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
```
- `mapState`：映射state中的数据为计算属性
    ```js
    computed: {
        ...mapState({组件中的变量名:'state中的变量名',}),
        //如果组件中的变量名与state中的变量名相同，还可以写成，下面类似
        ...mapState(['变量名',]),
    },
    ```
- `mapGetters`：映射getters中的数据为计算属性
    ```js
    computed: {
        ...mapGetters({组件中的变量名:'state中的变量名'}),
        ...mapGetters(['变量名'])
    },
    ```
- `mapActions`：映射actions中的函数(dispatch)为methods
    ```js
    /* 原写法 */
    methods方法名(){
        this.$store.dispatch('actions方法名', 数据)
    }
    /* 新写法（还是写在methods中） */
    ...mapActions({methods方法名:'actions方法名',})
    ...mapActions(['方法名'])
    // 标签中写成：@click="methods方法名(数据)"
    ```
- `mapMutations`：映射mutations中的函数(commit)为methods
    ```js
    /* 与上面类似 */
    ...mapMutations({methods方法名:'mutations方法名',}),
    ...mapMutations(['方法名',]),
    ```

注意：
- 简写形式不是`{变量名}`，因为这样会转成`{'变量名': 变量名}`，而不是想要的`{'变量名': '变量名'}`
- mapActions与mapMutations使用时，若需要传递参数，需要在模板中绑定事件时传递，否则默认参数是事件对象

**例：用map系列函数改写上面的案例**
```html
<!-- MyCount.vue -->
<div>
    <h1>当前求和为：{{sum}}</h1>
    <h2>当前求和*10为：{{bigSum}}</h2>
    <select v-model.number="num">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
    </select>
    <button @click="increment(num)">+</button>
    <button @click="decrement(num)">-</button>
    <button @click="incrementOdd(num)">当前和为奇数再加</button>
    <button @click="incrementWait(num)">等一等再加</button>
</div>
<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
export default {
    name: "MyCount",
    data() { return {num: 1} },
    computed:{
        ...mapState({sum:'count'}),
        ...mapGetters(['bigSum']),
    },
    methods: {
        ...mapMutations({increment:'ADD', decrement:'MINUS'}),
        ...mapActions({incrementOdd:'addOdd', incrementWait:'addWait'})
    },
}
</script>
```
##### 模块化

