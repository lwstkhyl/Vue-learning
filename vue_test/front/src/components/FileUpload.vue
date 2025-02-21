<template>
  <div class="file-upload">
    <!-- 上传触发区域 -->
    <div 
      class="drop-zone"
      @dragover.prevent="dragover"
      @dragleave.prevent="dragleave"
      @drop.prevent="drop"
      :class="{ 'dragover': isDragover }"
    >
      <el-button @click="triggerFileInput">选择文件/文件夹</el-button>
      <input 
        type="file"
        ref="fileInput"
        multiple
        webkitdirectory
        @change="handleFileSelect"
        style="display: none;"
      >
      <div class="hint-text">或将文件/文件夹拖拽到此区域</div>
    </div>

    <!-- 上传队列 -->
    <div class="upload-queue">
      <div 
        v-for="(file, index) in uploadQueue"
        :key="file.id"
        class="upload-item"
      >
        <div class="file-info">
          <div class="filename">{{ file.name }}</div>
          <div class="path">{{ file.relativePath }}</div>
        </div>

        <div class="progress-info">
          <el-progress 
            :percentage="file.progress"
            :status="file.status"
            :stroke-width="16"
          />
          <div class="stats">
            <span class="speed">{{ formatSpeed(file.speed) }}</span>
            <span class="size">{{ formatSize(file.loaded) }}/{{ formatSize(file.total) }}</span>
          </div>
        </div>

        <el-button 
          class="cancel-btn"
          @click="cancelUpload(index)"
          :disabled="file.status !== 'uploading'"
        >
          {{ file.status === 'uploading' ? '取消' : '移除' }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      isDragover: false,
      uploadQueue: [],
      cancelTokens: []
    };
  },
  methods: {
    // 触发文件选择
    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    // 处理文件选择
    async handleFileSelect(e) {
      const files = Array.from(e.target.files);
      this.processFiles(files);
      e.target.value = ''; // 清除input
    },

    // 处理拖放文件
    async drop(e) {
      this.isDragover = false;
      const items = e.dataTransfer.items;
      const files = [];

      const traverseDirectory = async (entry, path = '') => {
        if (entry.isFile) {
          return new Promise(resolve => {
            entry.file(file => {
              file.relativePath = path + file.name;
              files.push(file);
              resolve();
            });
          });
        } else if (entry.isDirectory) {
          const dirReader = entry.createReader();
          const entries = await new Promise(resolve => 
            dirReader.readEntries(resolve)
          );
          
          for (const entry of entries) {
            await traverseDirectory(entry, path + entry.name + '/');
          }
        }
      };

      for (const item of items) {
        const entry = item.webkitGetAsEntry();
        if (entry) await traverseDirectory(entry);
      }

      this.processFiles(files);
    },

    // 处理文件预处理
    processFiles(files) {
      files.forEach(file => {
        const id = Date.now() + Math.random();
        this.uploadQueue.push({
          id,
          name: file.name,
          relativePath: file.relativePath || '',
          progress: 0,
          speed: 0,
          loaded: 0,
          total: file.size,
          status: 'pending',
          file
        });

        this.startUpload(id);
      });
    },

    // 开始上传
    async startUpload(id) {
      const index = this.uploadQueue.findIndex(f => f.id === id);
      const fileObj = this.uploadQueue[index];
      const formData = new FormData();
      
      formData.append('files', fileObj.file);
      formData.append('path', fileObj.relativePath);

      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();
      this.cancelTokens[index] = source;

      const startTime = Date.now();
      let lastLoaded = 0;

      try {
        fileObj.status = 'uploading';
        
        await axios.post('/api/upload', formData, {
        onUploadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            const currentTime = Date.now();
            const timeDiff = (currentTime - startTime) / 1000;
            
            // 计算瞬时速度 (bytes/s)
            const speed = (loaded - lastLoaded) / (timeDiff || 0.1);
            lastLoaded = loaded;

            Object.assign(fileObj, {
            progress: Math.round((loaded / total) * 100),
            loaded,
            total,
            speed
            });
        },
        cancelToken: source.token
        });

        fileObj.status = 'success';
    } catch (err) {
        if (axios.isCancel(err)) {
        fileObj.status = 'canceled';
        } else {
        fileObj.status = 'exception';
        }
        }
    },

    // 取消上传
    cancelUpload(index) {
        if (this.cancelTokens[index]) {
            this.cancelTokens[index].cancel('User canceled upload');
        }
        this.uploadQueue.splice(index, 1);
        this.cancelTokens.splice(index, 1);
    },

    // 格式化工具方法
    formatSpeed(bytesPerSecond) {
        if (bytesPerSecond === 0) return '0 B/s';
        
        const units = ['B/s', 'KB/s', 'MB/s'];
        let speed = bytesPerSecond;
        
        for (const unit of units) {
            if (speed < 1024) return `${speed.toFixed(1)} ${unit}`;
            speed /= 1024;
        }
        
        return `${speed.toFixed(1)} GB/s`;
    },
    formatSize(bytes) {
            if (bytes === 0) return '0 B';
            
            const units = ['B', 'KB', 'MB', 'GB'];
            let size = bytes;
            
            for (const unit of units) {
                if (size < 1024) return `${size.toFixed(1)} ${unit}`;
                size /= 1024;
            }
            
            return `${size.toFixed(1)} TB`;
        }
    }
};
</script>

<style scoped>
.drop-zone {
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  transition: border-color 0.3s;
  margin-bottom: 20px;
}

.dragover {
  border-color: #409eff;
  background-color: rgba(64,158,255,0.05);
}

.upload-queue {
  max-height: 400px;
  overflow-y: auto;
}

.upload-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ebeef5;
}

.file-info {
  flex: 1;
  min-width: 200px;
  padding-right: 20px;
}

.filename {
  font-weight: 500;
}

.path {
  font-size: 12px;
  color: #909399;
}

.progress-info {
  flex: 2;
  min-width: 300px;
}

.stats {
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  font-size: 12px;
}

.speed {
  color: #67c23a;
}

.cancel-btn {
  margin-left: 20px;
}
</style>
