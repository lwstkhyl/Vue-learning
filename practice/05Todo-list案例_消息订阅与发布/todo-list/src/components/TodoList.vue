<template>
    <ul class="todo-main">
        <transition-group  name="todo" appear>
            <TodoItem v-for="todo in todos" :key="todo.id" :todo="todo"/>
        </transition-group>
    </ul> 
</template>

<script>
    import TodoItem from './TodoItem.vue'
    export default {
        name:"TodoList",
        components:{TodoItem},
        props:['todos']
        
    }
</script>

<style scoped>
    .todo-main {
        margin-left: 0px;
        border: 1px solid #ddd;
        border-radius: 2px;
        padding: 0px;
    }

    .todo-empty {
        height: 40px;
        line-height: 40px;
        border: 1px solid #ddd;
        border-radius: 2px;
        padding-left: 5px;
        margin-top: 10px;
    }

    /* 动画 */
    .todo-enter-active{
        animation: show 1s;
    }

    .todo-leave-active{
        animation: show 1s reverse;
    }

    @keyframes show {
        from{
            transform: translateX(100%);
        }
        to{
            transform: translateX(0);
        }
    }
</style>
