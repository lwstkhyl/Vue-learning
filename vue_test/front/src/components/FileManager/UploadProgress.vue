<template>
    <div class="upload-list">
        <div v-for="(file, index) in uploadQueue" :key="file.id" class="upload-item">
        <div class="file-info">
            <span>{{ file.name }} ({{ formatSize(file.size) }})</span>
            <el-button 
            size="mini" 
            @click="cancelUpload(index)"
            :disabled="file.status !== 'uploading'"
            >取消</el-button>
        </div>
        <el-progress 
            :percentage="file.progress"
            :status="file.status === 'error' ? 'exception' : undefined"
        />
        <div v-if="file.status === 'error'" class="error-msg">上传失败</div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['uploadQueue'],
    methods: {
        formatSize: bytes => (bytes / 1024 / 1024).toFixed(2) + ' MB',
        cancelUpload(index) {
        this.$emit('cancel', index);
        }
    }
}
</script>
