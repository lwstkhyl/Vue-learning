<template>
    <div>
        <ul>
            <li v-for="message in messageList" :key="message.id">
                <!-- query字符串写法 -->
                <!-- <router-link :to="`/home/message/detail?id=${message.id}&msg=${message.msg}`">{{message.msg}}</router-link> -->
                <!-- query对象写法 -->
                <!-- <router-link :to="{
                    path:'/home/message/detail',
                    query:{
                        id:message.id,
                        msg:message.msg
                    }
                }">
                    {{message.msg}}
                </router-link> -->
                <!-- params字符串写法 -->
                <!-- <router-link :to="`/home/message/detail/${message.id}/${message.msg}`">{{message.msg}}</router-link> -->
                <!-- params对象写法 -->
                <router-link :to="{
                    name:'detail',
                    params:{
                        id:message.id,
                        msg:message.msg
                    }
                }">
                    {{message.msg}}
                </router-link>
                <button @click="push(message)">push</button>
                <button @click="replace(message)">replace</button>
            </li>
        </ul>
        <hr>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name:'MyMessage',
    data() {
        return {
            messageList:[
                {id:'001', msg:'message001'},
                {id:'002', msg:'message002'},
                {id:'003', msg:'message003'},
            ]
        }
    },
    methods: {
        push(message){
            this.$router.push({
                name:'detail',
                params:{
                    id:message.id,
                    msg:message.msg
                }
            })
            //也可以写成：
            // this.$router.push(`/home/message/detail/${message.id}/${message.msg}`)
        },
        replace(message){
            this.$router.replace({
                name:'detail',
                params:{
                    id:message.id,
                    msg:message.msg
                }
            })
        },
    },
}
</script>
