<template>
    <li>
        <label>
            <input type="checkbox" :checked="todo.done" @change="HandleCheck(todo.id)"/>
            <!-- 如果完成，就默认勾选 -->
            <span v-show="!todo.isEdit">{{todo.title}}</span>
            <input 
                type="text"
                ref="edit_input"
                v-show="todo.isEdit" 
                @blur="ExitEdit(todo, $event)" 
                @keyup.enter="ExitEdit(todo, $event)" 
                :value="todo.title"
            >
        </label>
        <button 
            class="btn btn-danger" 
            @click="HandleDelete(todo.id)"
        >删除</button>
        <button 
            class="btn btn-edit" 
            v-show="!todo.isEdit" 
            @click="HandleEdit(todo)"
        >编辑</button>
    </li>
</template>

<script>
    import pubsub from 'pubsub-js'
    export default {
        name:"TodoItem",
        props:['todo'],
        methods: {
            HandleCheck(id){
                pubsub.publish('checkTodo', id);
            },
            HandleDelete(id){
                if(confirm("确定删除吗？")) pubsub.publish('deleteTodo', id);
            },
            HandleEdit(todo){
                if(!Object.hasOwnProperty.call(todo,'isEdit')){ //如果todo上没有isEdit就添加属性
                    this.$set(todo, 'isEdit', true);
                }else{ //有就直接修改值
                    todo.isEdit = true;
                }
                // setTimeout(()=>this.$refs.edit_input.focus(), 0);
                this.$nextTick(()=>this.$refs.edit_input.focus());
            },
            ExitEdit(todo, e){
                if(!todo.isEdit) return; //不重复退出
                todo.isEdit = false;
                const value = e.target.value.trim();
                if(!value) return alert("输入不能为空");
                pubsub.publish(
                    'editTodo', 
                    {id: todo.id, value: value}
                );
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
