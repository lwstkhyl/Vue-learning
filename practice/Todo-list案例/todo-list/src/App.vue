<template>
	<div id="app">
		<div class="todo-container">
			<div class="todo-wrap">
				<TodoHeader :addTodo="addTodo"/>
				<TodoList :todos="todos" :checkTodo="checkTodo" :deleteTodo="deleteTodo"/>
				<TodoFooter :todos="todos"/>
			</div>
		</div>
	</div>
</template>

<script>
	import TodoHeader from './components/TodoHeader.vue'
	import TodoList from './components/TodoList.vue'
	import TodoFooter from './components/TodoFooter.vue'

	export default {
		name: 'App',
		components: {TodoHeader,TodoList,TodoFooter},
		data() {
            return {
                todos:[
					{id:'001', title:"吃饭", done:true},
					{id:'002', title:"睡觉", done:false},
					{id:'003', title:"写作业", done:false},
				]
            }
        },
		methods: {
			addTodo(todo){ //添加一个todo
				this.todos.unshift(todo); //添加到数组的最前面，让新事项展示在列表最上方
			},
			checkTodo(id){ //勾选/取消勾选
				this.todos.forEach(todo=>{
					if(todo.id===id) todo.done = !todo.done;
				});
			},
			deleteTodo(id){
				this.todos = this.todos.filter(todo=>{
					return todo.id !== id;
				});
			}
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
