<template>
  <div class="file-manager">
    <!-- 新建文件夹组件 -->
    <el-dialog title="新建文件夹" :visible.sync="visible">
      <el-input v-model="folderName" placeholder="输入文件夹名称" @keyup.enter.native="createFolder"></el-input>
      <div slot="footer" style="text-align: center;">
        <el-button 
          type="primary" 
          @click="createFolder"
          :loading="loadingStates.createFolder"
          :disabled="loadingStates.createFolder" 
        >确认</el-button>
      </div>
    </el-dialog>

    <!-- 上传和上传队列 -->
    <el-row type="flex" class="row-bg " justify="space-between" align="middle">
      <!-- 上传区域 -->
      <!-- <el-upload
        v-show="isLoggedIn"
        class="upload-demo"
        drag
        multiple
        action="#"
        :http-request="handleUpload"
        :show-file-list="false"
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">拖拽或<em>点击上传文件</em></div>
      </el-upload> -->
      <FileUpload :loadFiles="loadFiles" :updateTotalSize="updateTotalSize"/>

      
    </el-row>
    <!-- 刷新/下载和删除选中/总占用空间 -->
    <el-row type="flex" class="row-bg" justify="space-between" align="middle" :gutter="20">
      <el-col :span="16">
        <!-- 刷新 -->
        <el-button 
          icon="el-icon-refresh" 
          :loading="loadingStates.refresh"
          :disabled="loadingStates.refresh"
          @click="handleRefresh"
        ></el-button>
        <!-- 新建文件夹 -->
        <el-button 
          v-show="isLoggedIn" 
          type="primary"
          @click="visible = true"
        >新建文件夹</el-button>
        <!-- 下载选中文件 -->
        <el-button 
          v-show="selectedFiles.length" 
          type="primary" plain
          :disabled="loadingStates.delete || loadingStates.download"
          :loading="loadingStates.download"
          @click="downloadSelected"
        >下载选中文件</el-button>
        <!-- 删除选中文件 -->
        <el-button 
          v-show="selectedFiles.length && isLoggedIn"
          type="danger" plain
          :loading="loadingStates.delete"
          :disabled="loadingStates.delete"
          @click="handleDelete"
        >删除选中文件</el-button>
      </el-col>
      <el-col :span="8">
        <div class="stat">
          总占用空间：<i>{{ !loadingStates.storage ? formatSize(totalSize) : '计算中...' }}</i>
        </div>
      </el-col>
    </el-row>

    <!-- 文件展示区域 -->
    <div class="fileShow">
      <!-- 路径导航 -->
        <el-breadcrumb 
          separator="|"
          class="path-navigation"
        >
          <el-breadcrumb-item 
            v-show="loadingStates.fileList" 
          >加载中...</el-breadcrumb-item>
          <template v-if="!loadingStates.fileList">
            <el-breadcrumb-item 
              v-show="pathParts.length && !loadingStates.fileList" 
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
          </template>
        </el-breadcrumb>

      <!-- 文件列表 -->
      <el-table 
        :data="files"
        ref="fileTable"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        @row-click="rowClick"  
        :row-style="rowStyle" 
        :row-class-name="rowClassName"
        v-loading="loadingStates.fileList"
        element-loading-text="加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.2)"
        :empty-text="loadingStates.fileList ? '...' : emptyText"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="名称">
          <template v-slot="{ row }">
            <span 
              class="file-item"
              :class="row.type === 'directory' ? 'file-item-folder' : 'file-item-document'"
              @click="handleItemClick(row, $event)"
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
              :disabled="loadingStates.delete || loadingStates.download"
              :loading="loadingStates.download"
              @click.stop="downloadFile(row.path, row.type)"
            >下载</el-button>
            <el-button 
              v-show="isLoggedIn"
              type="danger" 
              size="mini"
              :loading="loadingStates.delete"
              :disabled="loadingStates.delete"
              @click.stop="deleteFile(row.path)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters, mapActions, mapMutations} from 'vuex';
import {baseURL} from '../../config/config'
import request from '../api/request';
import {encodeFileName} from '../utils/crypto';
import {formatSize, formatTime} from '../utils/formatters';
import FileUpload from './FileUpload.vue'

export default {
  name: 'FileManager',
  components: { FileUpload, },
  props: ['currentPath'],
  data() {
    return {
      files: [], //文件列表
      emptyText: '...', //文件列表为空/加载失败时显示的文本
      currentDir: this.currentPath, //当前目录
      totalSize: null, //总占用空间
      selectedFiles: [], //表格中已选中的文件
      visible: false, //新建文件夹
      folderName: '', //新建文件夹名称
      formatSize, formatTime, //格式化函数
    }
  },

  computed: {
    ...mapState('auth', {isLoggedIn: 'token'}),
    ...mapState('pan', ['loadingStates']),
    pathParts() { //分隔目录
      return this.currentDir.split('/').filter(p => p) //过滤掉空字符串
    },
  },

  async mounted() {
    this.loadFiles();
    this.updateTotalSize();
  },

  methods: {
    ...mapActions('pan', ['withLoading']),

    //加载文件列表
    async loadFiles() {
      this.files = [];
      await this.withLoading({
        type: 'fileList',
        fn: async () => {
          try {
            const res = await request.get('/files', {
              params: { path: this.currentDir }
            })
            this.files = res.data.files
            this.emptyText = '此目录中无文件';
            this.$router.push({ // 更新URL
              query: { path: this.currentDir } 
            })
          } catch (err) {
            this.files = [];
            this.emptyText = '加载失败，请重试';
            this.$message.error('加载文件列表失败')
          }
        }
      });
    },

    //更新总占用空间
    async updateTotalSize() {
      this.totalSize = null;
      await this.withLoading({
        type: 'storage',
        fn: async () => {
          try {
            const res = await request.get('/stats');
            this.totalSize = res.data.totalSize;
          } catch (err) {
            this.totalSize = null;
            this.$message.error('计算总占用空间失败');
          }
        }
      });
    },

    //刷新
    async handleRefresh(){
      await this.withLoading({
        type: 'refresh',
        fn: async () => {
          await Promise.all([
            this.loadFiles(),
            this.updateTotalSize()
          ]);
        }
      });
    },

    //点击表格中文件夹时更改当前目录
    handleItemClick(item, e) {
      if (item.type === 'directory') {
        e.stopPropagation();
        this.currentDir = item.path
        this.loadFiles()
      }
    },

    //点击文件导航栏时更改当前目录
    navigateTo(index) {
      const parts = this.pathParts.slice(0, index + 1)
      this.currentDir = parts.join('/')
      this.loadFiles()
    },
    
    //上传文件
    async handleUpload({ file }) {
      // 编码文件名
      const encodedFile = new File([file], encodeFileName(file.name), {
        type: file.type,
        lastModified: file.lastModified
      });
      const formData = new FormData();
      formData.append('files', encodedFile);
      formData.append('path', encodeURIComponent(this.currentDir));
      let isSuccess = true;
      try {
        await request.post('/upload', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data;charset=UTF-8',
            'Authorization': `Bearer ${this.token}`
          },
        });
        this.$message.success('上传成功');
      } catch (err) {
        this.$message.error('上传失败');
        isSuccess = false;
      }
      if(!isSuccess) return;
      this.loadFiles();
      this.updateTotalSize();
    },
    
    //创建文件夹
    async createFolder(){
      if (!this.folderName.trim()) return this.$message.error('文件夹名不能为空');
      await this.withLoading({
        type: 'createFolder',
        fn: async () => {
          let isSuccess = true;
          try{
            await request.post('/create', {
              folderPath: this.currentPath,
              folderName: this.folderName.trim()
            });
            this.folderName = '';
            this.visible = false;
            this.$message.success('创建成功');
          } catch (err) {
            isSuccess = false;
            this.$message.error(`创建失败${err.response?'：'+err.response.data.error: ''}`);
          }
          if(!isSuccess) return;
          this.loadFiles();
          this.updateTotalSize();
        }
      });
    },

    //删除单个文件
    async deleteFile(path) {
      await this.withLoading({
        type: 'delete',
        fn: async () => {
          let isSuccess = true;
          try {
            await request.delete(`/files/${encodeURIComponent(path)}`);
            this.$message.success('删除成功');
          } catch (err) {
            isSuccess = false;
            this.$message.error('删除失败');
          }
          if(!isSuccess) return;
          this.loadFiles();
          this.updateTotalSize();
        }
      });
    },

    //删除多个文件
    async handleDelete() {
      await this.withLoading({
        type: 'delete',
        fn: async () => {
          let isSuccess = true;
          await Promise.all(
            this.selectedFiles.map(async ({path}) => {
              try {
                await request.delete(`/files/${encodeURIComponent(path)}`);
              } catch (err) {
                isSuccess = false;
                this.$message.error(`删除失败：${path}`);
              }
            }
          ));
          if(isSuccess) this.$message.success('删除成功');
          else return this.$message.error(`删除选中文件失败`); 
          this.loadFiles();
          this.updateTotalSize();
        }
      });
    },

    //表格处理（点击行时选中该行）
    handleSelectionChange(files){
      this.selectedFiles = files; 
    },
    rowStyle({row,rowIndex}) {
      Object.defineProperty(row, 'rowIndex', {
          value: rowIndex, 
          writable: true,
          enumerable: false
          })
      },
    rowClick(row, column, event) {
          let refsElTable = this.$refs.fileTable;
          let findRow = this.selectedFiles.find(c => c.rowIndex == row.rowIndex);
          if (findRow) {
              refsElTable.toggleRowSelection(row, false);
              return;
          }
          refsElTable.toggleRowSelection(row,true);
      },
    rowClassName({ row,  rowIndex }) {
          let rowName = "",
          findRow = this.selectedFiles.find(c => c.rowIndex === row.rowIndex);
          if (findRow) {
              rowName = "current-row "; 
          }
          return rowName;
      },

    //单选下载
    async downloadFile(path, type) {
      await this.withLoading({
        type: 'download',
        fn: () => {
          try{
            if(type === 'directory'){ //如果要下载的是目录
              window.open(
                `${baseURL}/api/download/?files=${encodeURIComponent(JSON.stringify(path))}`
              );
            } else { //如果是普通单一文件
              window.open(
                `${baseURL}/api/download/${encodeURIComponent(path)}`,
              );
            }
          } catch(err) {
            this.$message.error('下载失败');
          }
        }
      });
    },

    // 多选下载
    async downloadSelected() {
      await this.withLoading({
        type: 'download',
        fn: () => {
          try{
            if (this.selectedFiles.length === 1 && this.selectedFiles[0].type !== 'directory') {
              return this.downloadFile(this.selectedFiles[0].path);
            }
            const paths = this.selectedFiles.map(f => f.path);
            window.open(
              `${baseURL}/api/download/?files=${encodeURIComponent(JSON.stringify(paths))}`
            );
          } catch(err) {
            this.$message.error('下载失败');
          }
        }
      });
    },
  }
}
</script>
<style>
.upload-demo, .el-upload, .el-upload-dragger{
  width: 100% !important;
}
.file-item {
  padding: 5px;
}
.file-item-folder{
  cursor: pointer;
}
.path-navigation{
  margin: 10px;
}
.el-breadcrumb__inner {
  cursor: pointer;
}
.click-a .el-breadcrumb__inner:hover{
  text-decoration: underline
}
.click-a .el-breadcrumb__inner{
  color: #09AAFF;
}

.el-table__body tr:hover>td{
    background-color: hsla(201, 100%, 66%, 0.356) !important;
}



.el-radio:focus:not(.is-focus):not(:active):not(.is-disabled) .el-radio__inner {
    box-shadow: none;
}

.stat{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  font-size: 16px;
  color: #606266;
  font-weight: 500;
  text-align: right;
}
.stat i{
  color: #909399;
  font-weight: bold;
  font-style: normal;
}
</style>