<template>
    <div>
        <h2>Home组件内容</h2>
        <div>
            <ul class="nav nav-tabs">
                <li><router-link class="list-group-item" to="/home/news">News</router-link></li>
                <li><router-link active-class="active" class="list-group-item" to="/home/message">Message</router-link></li>
            </ul>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MyHome',

}
</script>
