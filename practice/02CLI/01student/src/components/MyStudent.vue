<template>
    <div class="student">
        <h2>学生名称：{{name}}</h2>
        <h2>学生年龄：{{age}}</h2>
        <button @click="show">点击展示学生信息</button>
    </div>
</template>
<script>
    export default {
        name:"MyStudent", //name属性值尽量与文件名保持一致
        data() {
            return {
                name: "abc",
                age: 18
            };
        },
        methods:{
            show(){
                alert(`
                    学生名称：${this.name}
                    学生年龄：${this.age}
                `);
            }
        }
    }
</script>
<style>
    .student{
        background-color: pink;
    }
</style>
