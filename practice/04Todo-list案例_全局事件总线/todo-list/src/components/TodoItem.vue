<template>
    <li>
        <label>
            <input type="checkbox" :checked="todo.done" @change="HandleCheck(todo.id)"/>
            <!-- 如果完成，就默认勾选 -->
            <span>{{todo.title}}</span>
        </label>
        <button class="btn btn-danger" @click="HandleDelete(todo.id)">删除</button>
    </li>
</template>

<script>
    export default {
        name:"TodoItem",
        props:['todo'],
        methods: {
            HandleCheck(id){
                this.$bus.$emit('checkTodo', id);
            },
            HandleDelete(id){
                if(confirm("确定删除吗？")) this.$bus.$emit('deleteTodo', id);
            }
        },
    }
</script>

<style scoped>
    li {
        list-style: none;
        height: 36px;
        line-height: 36px;
        padding: 0 5px;
        border-bottom: 1px solid #ddd;
    }

    li label {
        float: left;
        cursor: pointer;
    }

    li label li input {
        vertical-align: middle;
        margin-right: 6px;
        position: relative;
        top: -1px;
    }

    li button {
        float: right;
        display: none;
        margin-top: 3px;
    }

    li:before {
        content: initial;
    }

    li:last-child {
        border-bottom: none;
    }
    li:hover{
        background-color: #ddd;
    }
    li:hover button{
        display: block;
    }
</style>
