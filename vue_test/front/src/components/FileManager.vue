<template>
  <div class="file-manager">
    <nav-bar :isLoggedIn="isLoggedIn"/>
    <div class="stats">总空间：{{ formatSize(totalSize) }}</div>
    <!-- 操作栏 -->
    <div class="action-bar">
        <el-button icon="el-icon-refresh" class="el-button el-button--primary" @click="refresh"></el-button>
    </div>
    <!-- 上传区域 -->
    <el-upload
      v-show="isLoggedIn"
      class="upload-demo"
      drag
      multiple
      action="#"
      :http-request="handleUpload"
      :show-file-list="false"
    >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
  </el-upload>
    <!-- <el-upload
      action="#"
      multiple
      :http-request="handleUpload"
      :show-file-list="false"
    >
      
    </el-upload> -->
    <!-- 新建文件夹 -->
    <el-button v-show="isLoggedIn" @click="visible = true">新建文件夹</el-button>

    <!-- 路径导航 -->
    <div class="path-navigation">
      <el-breadcrumb separator="|">
        <el-breadcrumb-item 
          v-show="pathParts.length" 
          @click.native="navigateTo(pathParts.length-2)" 
          class="click-a"
        >返回上一级</el-breadcrumb-item>
        <el-breadcrumb separator=">">
          <el-breadcrumb-item 
            @click.native="navigateTo(-1)"
            :class="pathParts.length ? 'click-a' : ''" 
          >全部文件</el-breadcrumb-item>
          <el-breadcrumb-item 
            v-for="(part, index) in pathParts" 
            :key="index"
            @click.native="navigateTo(index)"
            :class="(index === pathParts.length-1) ? '' : 'click-a'"
          >{{ part || '全部文件' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-breadcrumb>
    </div>

    <!-- 文件列表 -->
    <el-table 
      :data="files" 
      @selection-change="handleSelectionChange"
      style="width: 100%"
    >
      <el-table-column type="selection" width="55">

      </el-table-column>
      <el-table-column prop="name" label="名称">
        <template v-slot="{ row }">
          <span 
            class="file-item"
            :class="row.type === 'directory' ? 'file-item-folder' : 'file-item-document'"
            @click="handleItemClick(row)"
          >
            <i :class="row.type === 'directory' ? 'el-icon-folder' : 'el-icon-document'"></i>
            {{ row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小" width="120">
        <template v-slot="{ row }">
          {{ row.type === 'directory' ? '-' : formatSize(row.size) }}
        </template>
      </el-table-column>
      <el-table-column prop="ctimeMs" label="修改时间" width="240">
        <template v-slot="{ row }">
          {{ formatTime(row.ctimeMs) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button 
            size="mini"
            @click="downloadFile(row.path, row.type)"
          >下载</el-button>
          <el-button 
            v-show="isLoggedIn"
            type="danger" 
            size="mini"
            @click="deleteFile(row.path)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新建文件夹组件 -->
    <el-dialog title="新建文件夹" :visible.sync="visible">
      <el-input v-model="folderName" placeholder="输入文件夹名称"></el-input>
      <div slot="footer">
        <el-button @click="visible = false; folderName = ''">取消</el-button>
        <el-button type="primary" @click="createFolder">确认</el-button>
      </div>
    </el-dialog>
    <el-button v-show="selectedFiles.length" type="primary" @click="downloadSelected">下载选中文件</el-button>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import {baseURL} from '../../config/config'
import request from '../api/request';
import { encodeFileName } from '../utils/crypto';
import NavBar from './NavBar.vue';

export default {
  components: { NavBar },
  name: 'FileManager',
  props: ['currentPath'],
  data() {
    return {
      files: [],
      currentDir: this.currentPath,
      totalSize: 0,
      selectedFiles: [],
      visible: false, //新建文件夹
      folderName: ''
    }
  },
  computed: {
    pathParts() {
      return this.currentDir.split('/').filter(p => p)
    },
    isLoggedIn() {
      return !!this.$store.state.token;
    }
  },
  watch: {
    currentPath(newVal) {
      this.currentDir = newVal
      this.loadFiles()
    }
  },
  async mounted() {
    await this.loadFiles();
  },
  methods: {
    async loadFiles() {
      try {
        const res = await request.get('/files', {
          params: { path: this.currentDir }
        })
        this.totalSize = (await request.get('/stats')).data.totalSize;
        this.files = res.data.files
        // 更新URL
        this.$router.push({ 
          query: { path: this.currentDir } 
        })
      } catch (err) {
        this.$message.error('加载文件列表失败')
      }
    },

    refresh(){
      this.loadFiles()
    },

    handleItemClick(item) {
      if (item.type === 'directory') {
        this.currentDir = item.path
        this.loadFiles()
      }
    },

    navigateTo(index) {
      const parts = this.pathParts.slice(0, index + 1)
      this.currentDir = parts.join('/')
      this.loadFiles()
    },
    
    async handleUpload({ file }) {
      // 编码文件名
      const encodedFile = new File([file], encodeFileName(file.name), {
        type: file.type,
        lastModified: file.lastModified
      });
      const formData = new FormData();
      formData.append('files', encodedFile);
      formData.append('path', encodeURIComponent(this.currentDir));
      try {
        await request.post('/upload', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data;charset=UTF-8',
            'Authorization': `Bearer ${this.$store.state.token}`
          },
        });
        await this.loadFiles();
      } catch (err) {
        this.$message.error('上传失败');
      }
    },
    
    async deleteFile(path) {
      try {
        await request.delete(`/files/${encodeURIComponent(path)}`);
        await this.loadFiles();
      } catch (err) {
        this.$message.error('删除失败');
      }
    },

    async createFolder(){
      if (!this.folderName.trim()) return this.$message.error('文件夹名不能为空');
      try{
        await request.post('/create', {
          folderPath: this.currentPath,
          folderName: this.folderName.trim()
        });
        this.folderName = '';
        this.visible = false;
        this.$message.success('创建成功');
        await this.loadFiles();
      } catch (err) {
        this.$message.error(`创建失败：${err.response.data.error}`);
      }
    },

    handleSelectionChange(files){
      this.selectedFiles = files; 
    },
    
    //单选下载
    downloadFile(path, type) {
      if(type === 'directory'){ //如果要下载的是目录
        window.open(
          `${baseURL}/api/download/?files=${encodeURIComponent(JSON.stringify(path))}`
        );
      } else { //如果是普通单一文件
        window.open(
          `${baseURL}/api/download/${encodeURIComponent(path)}`,
          '_blank'
        );
      }
    },

    // 多选下载
    async downloadSelected() {
      if (this.selectedFiles.length === 1 && this.selectedFiles[0].type !== 'directory') {
        return this.downloadFile(this.selectedFiles[0].path);
      }
      const paths = this.selectedFiles.map(f => f.path);
      window.open(
        `${baseURL}/api/download/?files=${encodeURIComponent(JSON.stringify(paths))}`
      );
    },

    formatSize(bytes) {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      for (const unit of units) {
          if (size < 1024) return `${size.toFixed(2)} ${unit}`;
          size /= 1024;
      }
      return `${size.toFixed(2)} GB`;
    },

    formatTime(timeStamp){
      return dayjs(timeStamp).format('YYYY-MM-DD HH:mm');
    }
  }
}
</script>
<style>
.file-item {
  padding: 5px;
}
.file-item-folder{
  cursor: pointer;
}
/* .file-item.directory:hover {
  background: #f5f7fa;
} */
.path-navigation{
  margin: 10px;
}
.el-breadcrumb__inner {
  cursor: pointer;
}
.click-a .el-breadcrumb__inner:hover{
  text-decoration: underline
}
.path-navigation{
  margin-top: 10px;
}
.click-a .el-breadcrumb__inner{
  color: #09AAFF;
}
</style>