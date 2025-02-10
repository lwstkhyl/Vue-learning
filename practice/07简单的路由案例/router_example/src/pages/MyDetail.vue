<template>
    <div>
        <ul>
            <!-- <li>消息编号：{{$route.query.id}}</li> -->
            <!-- <li>消息标题：{{$route.query.msg}}</li> -->
            <!-- <li>消息编号：{{$route.params.id}}</li> -->
            <!-- <li>消息标题：{{$route.params.msg}}</li> -->
            <li>消息编号：{{id}}</li>
            <li>消息标题：{{msg}}</li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'MyDetail',
    props: ['id', 'msg']
}
</script>

<style>

</style>