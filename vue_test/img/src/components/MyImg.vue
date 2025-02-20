<template>
  <div class="container">
    <!-- 左侧操作区域 -->
    <div class="left-panel">
      <input type="file" @change="handleFileUpload" accept="image/*">
      <div class="image-container" ref="imageContainer">
        <img :src="imageUrl" ref="image" @load="initCropBox">
        <div class="crop-box" :style="cropStyle" @mousedown.prevent="startDrag">
          <div class="resize-handle" @mousedown.prevent="startResize"></div>
        </div>
      </div>
    </div>

    <!-- 右侧预览区域 -->
    <div class="right-panel">
      <div class="preview-section">
        <div class="preview-box">
          <canvas ref="previewCanvas"></canvas>
        </div>
        <div class="preview-box-round">
          <canvas ref="previewCanvasRound"></canvas>
        </div>
      </div>
      <button class="download-btn" @click="downloadImage(false)" :disabled="!imageUrl">下载正方形裁剪图片</button>
      <button class="download-btn" @click="downloadImage(true)" :disabled="!imageUrl">下载圆形裁剪图片</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyImg',
  data() {
    return {
      canvasSize: 400,
      imageUrl: '',
      crop: {
        x: 0,
        y: 0,
        size: 100
      },
      imageWidth: 0,
      imageHeight: 0,
      isDragging: false,
      isResizing: false,
      startX: 0,
      startY: 0
    }
  },

  computed: {
    cropStyle() {
      return {
        left: `${this.crop.x}px`,
        top: `${this.crop.y}px`,
        width: `${this.crop.size}px`,
        height: `${this.crop.size}px`
      }
    }
  },

  methods: {
    // 处理文件上传
    handleFileUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      this.imageUrl = URL.createObjectURL(file);
    },

    // 初始化裁剪框
    initCropBox() {
      const img = this.$refs.image;
      this.imageWidth = img.offsetWidth;
      this.imageHeight = img.offsetHeight;
      
      // 初始居中显示
      this.crop = {
        x: (this.imageWidth - this.crop.size) / 2,
        y: (this.imageHeight - this.crop.size) / 2,
        size: 100
      };
      this.updatePreview();
    },

    // 开始拖动
    startDrag(e) {
      if(this.isResizing) return;
      this.isDragging = true;
      this.startX = e.clientX - this.crop.x;
      this.startY = e.clientY - this.crop.y;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },

    // 拖动处理
    onDrag(e) {
      if (!this.isDragging) return;
      
      let newX = e.clientX - this.startX;
      let newY = e.clientY - this.startY;

      // 边界约束
      newX = Math.max(0, Math.min(newX, this.imageWidth - this.crop.size));
      newY = Math.max(0, Math.min(newY, this.imageHeight - this.crop.size));

      this.crop.x = newX;
      this.crop.y = newY;
      this.updatePreview();
    },

    // 停止拖动
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },

    startResize(e) {
      this.isResizing = true;

      // 记录初始状态
      this.resizeStart = {
        x: e.clientX,
        y: e.clientY,
        size: this.crop.size,
        cropX: this.crop.x,
        cropY: this.crop.y
      };
      document.addEventListener('mousemove', this.onResize);
      document.addEventListener('mouseup', this.stopResize);
    },

    // 缩放处理（修改后）
    onResize(e) {
      if (!this.isResizing) return;
      
      // 计算鼠标移动距离
      const deltaX = e.clientX - this.resizeStart.x;
      const deltaY = e.clientY - this.resizeStart.y;
      
      // 计算新尺寸（保持正方形，取XY变化的最大值）
      const delta = Math.max(deltaX, deltaY);
      let newSize = Math.max(50, this.resizeStart.size + delta);

      // 计算最大允许尺寸（保持选框左上角不变）
      const maxSizeX = this.imageWidth - this.resizeStart.cropX;
      const maxSizeY = this.imageHeight - this.resizeStart.cropY;
      const maxSize = Math.min(maxSizeX, maxSizeY);
      
      newSize = Math.min(newSize, maxSize);

      // 更新尺寸（保持选框位置不变）
      this.crop.size = newSize;
      this.updatePreview();
    },

    // 停止缩放（修改后）
    stopResize() {
      this.isResizing = false;

      this.resizeStart = null; // 清除初始状态
      document.removeEventListener('mousemove', this.onResize);
      document.removeEventListener('mouseup', this.stopResize);
    },

    // 更新预览方法修改
    updatePreview() {
      this.drawPreview(this.$refs.previewCanvas, false); // 方形预览
      this.drawPreview(this.$refs.previewCanvasRound, true); // 圆形预览
    },

    // 新增绘制方法
    drawPreview(canvas, isRound) {
      const ctx = canvas.getContext('2d');
      const img = this.$refs.image;
      
      // 计算比例
      const ratioX = img.naturalWidth / img.offsetWidth;
      const ratioY = img.naturalHeight / img.offsetHeight;

      // 设置画布尺寸
      canvas.width = this.canvasSize;
      canvas.height = this.canvasSize;

      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isRound) {
        ctx.save();
        // 创建圆形裁剪路径
        ctx.beginPath();
        ctx.arc(this.canvasSize/2, this.canvasSize/2, this.canvasSize/2, 0, Math.PI * 2);
        ctx.clip();
      }

      // 绘制图像
      ctx.drawImage(
        img,
        this.crop.x * ratioX,
        this.crop.y * ratioY,
        this.crop.size * ratioX,
        this.crop.size * ratioY,
        0,
        0,
        this.canvasSize,
        this.canvasSize
      );

      if (isRound) {
        ctx.restore(); // 恢复绘图状态
      }
    },

    // 新增下载方法
    async downloadImage(isCircle) {
      const img = this.$refs.image;
      const naturalWidth = img.naturalWidth;
      const naturalHeight = img.naturalHeight;
      const displayWidth = img.offsetWidth;
      const displayHeight = img.offsetHeight;

      // 创建高分辨率画布
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // 计算实际裁剪尺寸（基于原始分辨率）
      const scaleX = naturalWidth / displayWidth;
      const scaleY = naturalHeight / displayHeight;
      const actualCropSize = this.crop.size * Math.max(scaleX, scaleY);
      
      // 设置画布尺寸为实际裁剪大小
      canvas.width = actualCropSize;
      canvas.height = actualCropSize;

      // 绘制原始尺寸图像
      ctx.drawImage(
        img,
        this.crop.x * scaleX,
        this.crop.y * scaleY,
        this.crop.size * scaleX,
        this.crop.size * scaleY,
        0,
        0,
        actualCropSize,
        actualCropSize
      );

      // 创建圆形遮罩
      if(isCircle){
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(actualCropSize/2, actualCropSize/2, actualCropSize/2, 0, Math.PI*2);
        ctx.fill();
      }

      // 转换为Blob并下载
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hd-image-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 'image/png');
    }
  },

  mounted() {
    window.addEventListener('resize', this.initCropBox);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.initCropBox);
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

.left-panel {
  flex: 1;
  padding: 20px;
}

.right-panel {
  width: 300px;
  padding: 20px;
  border-left: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-container {
  position: relative;
  margin-top: 20px;
  overflow: hidden;
}

.image-container img {
  max-width: 100%;
  display: block;
}

.crop-box {
  position: absolute;
  border: 1px solid #fff;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  cursor: move;
}

.resize-handle {
  position: absolute;
  right: -5px;
  bottom: -5px;
  width: 10px;
  height: 10px;
  background: #fff;
  cursor: nwse-resize;
}

.preview-box {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  margin-top: 20px;
}

.preview-box canvas {
  width: 100%;
  height: 100%;
}
.preview-section {
  width: 100%;
}

.preview-box-round {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  margin-top: 20px;
  border-radius: 50%;
  overflow: hidden;
}

.preview-box-round canvas {
  width: 100%;
  height: 100%;
}

.download-btn {
  margin-top: 20px;
  padding: 10px 30px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.download-btn:hover {
  background: #1976d2;
}
</style>
