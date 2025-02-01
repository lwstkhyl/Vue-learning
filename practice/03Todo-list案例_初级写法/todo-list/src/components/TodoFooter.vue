<template>
    <div class="todo-footer" v-show="total"> <!-- 如果一项任务都没有，就不展示底部栏 -->
        <label>
            <!-- <input type="checkbox" :checked="isAllDone" @click="checkAll"/> -->
            <input type="checkbox" v-model="isAllDone"/>
        </label>
        <span>
            <span>已完成{{doneTotal}}</span> / 全部{{total}}
        </span>
        <button class="btn btn-danger" @click="handleDeleteAllDone">清除已完成任务</button>
    </div>
</template>

<script>
    export default {
        name:"TodoFooter",
        props:['todos', 'checkAllTodo', 'deleteAllDone'],
        computed:{
            total(){
                return this.todos.length;
            }, 
            doneTotal(){
                /* let i =0;
                this.todos.forEach(todo => {
                    if(todo.done) i++;
                });
                return i; */
                return this.todos.reduce((prev, curr)=>prev+curr.done, 0); //精简写法
            },
            /* isAllDone(){ //一个计算属性可以通过其它计算属性计算得到
                if(this.total===0) return false; //如果总数为0就不勾选
                return this.total===this.doneTotal;
            }, */
            isAllDone:{
                get(){
                    return this.total===this.doneTotal&&this.total>0;
                },
                set(v){
                    this.checkAllTodo(v);
                }
            }
            
        },
        methods: {
            /* checkAll(e){
                this.checkAllTodo(e.target.checked);
            }, */
            handleDeleteAllDone(){
                this.deleteAllDone();
            }
        },
    }
</script>

<style scoped>
    .todo-footer {
        height: 40px;
        line-height: 40px;
        padding-left: 6px;
        margin-top: 5px;
    }

    .todo-footer label {
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
    }

    .todo-footer label input {
        position: relative;
        top: -1px;
        vertical-align: middle;
        margin-right: 5px;
    }

    .todo-footer button {
        float: right;
        margin-top: 5px;
    }
</style>
