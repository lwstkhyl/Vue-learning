<template>
	<div id="app">
		<div class="todo-container">
			<div class="todo-wrap">
				<TodoHeader :addTodo="addTodo"/>
				<TodoList :todos="todos"/>
				<TodoFooter :todos="todos" :checkAllTodo="checkAllTodo" :deleteAllDone="deleteAllDone"/>
			</div>
		</div>
	</div>
</template>

<script>
	import pubsub from 'pubsub-js'
	import TodoHeader from './components/TodoHeader.vue'
	import TodoList from './components/TodoList.vue'
	import TodoFooter from './components/TodoFooter.vue'

	export default {
		name: 'App',
		components: {TodoHeader,TodoList,TodoFooter},
		data() {
            return {
                todos:JSON.parse(localStorage.getItem('todos'))||[]
            }
        },
		methods: {
			addTodo(todo){ //添加一个todo
				this.todos.unshift(todo); //添加到数组的最前面，让新事项展示在列表最上方
			},
			checkTodo(_, id){ //勾选/取消勾选
				this.todos.forEach(todo=>{
					if(todo.id === id) todo.done = !todo.done;
				});
			},
			deleteTodo(_, id){ //删除指定事项
				this.todos = this.todos.filter(todo=>{
					return todo.id !== id;
				});
			},
			checkAllTodo(isCheck){ //全选按钮
				this.todos.forEach(todo=>{
					todo.done = isCheck;
				});
			},
			deleteAllDone(){ //删掉所有已完成
				this.todos = this.todos.filter(todo=>{
					return !todo.done;
				});
			},
			editTodo(_, {id, value}){ //修改
				this.todos.forEach(todo=>{
					if(todo.id === id) todo.title = value;
				});
			}
		},
		watch:{
			todos:{
				deep:true, //必须开启深度监视，否则属性值变化监测不到
				handler(v){
					localStorage.setItem('todos', JSON.stringify(v));
				}
			}
		},
		mounted() {
			this.pub_id1 = pubsub.subscribe('checkTodo', this.checkTodo);
			this.pub_id2 = pubsub.subscribe('deleteTodo', this.deleteTodo);
			this.pub_id3 = pubsub.subscribe('editTodo', this.editTodo);
		},
		beforeDestroy() {
			pubsub.unsubscribe(this.pub_id1);
			pubsub.unsubscribe(this.pub_id2);
			pubsub.unsubscribe(this.pub_id3);
		},
	}
</script>

<style>
	body {
		background: #fff;
	}

	.btn {
		display: inline-block;
		padding: 4px 12px;
		margin-bottom: 0;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
		vertical-align: middle;
		cursor: pointer;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 1px 2px rgba(0, 0, 0, 0.05);
		border-radius: 4px;
	}

	.btn-danger {
		color: #fff;
		background-color: #da4f49;
		border: 1px solid #bd362f;
	}

	.btn-edit {
		color: #fff;
		background-color: skyblue;
		border: 1px solid blue;
		margin-right: 5px;
	}

	.btn-danger:hover {
		color: #fff;
		background-color: #bd362f;
	}

	.btn:focus {
		outline: none;
	}

	.todo-container {
		width: 600px;
		margin: 0 auto;
	}
	.todo-container .todo-wrap {
		padding: 10px;
		border: 1px solid #ddd;
		border-radius: 5px;
	}
</style>
