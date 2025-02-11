<template>
    <ul>
        <p :style="{opacity}">opacity不断变化</p>
        <li>news001</li> <input type="text">
        <li>news002</li> <input type="text">
        <li>news003</li> <input type="text">
    </ul>
</template>

<script>
export default {
    name: 'MyNews',
    data() {return {opacity: 1}},
    activated() {
        this.timer = setInterval(()=>{
            this.opacity -= 0.01;
            if(this.opacity <= 0) this.opacity = 1;
        }, 16);
    },
    deactivated() {
        clearInterval(this.timer);
    },
}
</script>
