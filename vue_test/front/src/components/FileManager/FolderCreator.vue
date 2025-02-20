<template>
    <el-dialog title="新建文件夹" :visible.sync="visible">
        <el-input v-model="folderName" placeholder="输入文件夹名称"></el-input>
        <div slot="footer">
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="createFolder">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
        visible: false,
        folderName: ''
        }
    },
    methods: {
        show() {
            this.visible = true;
        },
        async createFolder() {
        if (!this.folderName) return;
        
        try {
            // await this.$api.createFolder({
            // path: this.currentPath,
            // name: this.folderName
            // });
            // this.$emit('created');
            // this.visible = false;
            // this.folderName = '';
        } catch (err) {
            this.$message.error('创建失败');
        }
        }
    }
    }
</script>
