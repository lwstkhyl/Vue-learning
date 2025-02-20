<template>
  <div class="main-container">
    <FileManager :currentPath="currentPath" />
  </div>
</template>

<script>
import FileManager from '../components/FileManager.vue'

export default {
  components: { FileManager },
  props: ['currentPath']
}
</script>
