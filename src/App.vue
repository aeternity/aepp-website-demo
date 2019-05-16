<template>
  <div id="app" class="min-h-screen">
    <div class="flex justify-center">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>


  export default {
    name: 'app',
    components: {},
  }
</script>

<style scoped>
  .min-h-screen {
    min-height: 100vh;
    padding-bottom: 0;
    background: #F1F4F7;
    max-height: 100vh;
    overflow-y: auto;
  }
</style>
