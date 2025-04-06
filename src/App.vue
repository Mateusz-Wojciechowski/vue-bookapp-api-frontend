<template>
  <!-- Używamy MainLayout jako opakowanie dla zawartości routingu -->
  <main-layout>
    <router-view/>
  </main-layout>
</template>

<script>
import MainLayout from './layouts/MainLayout.vue'

export default {
  name: 'App',
  components: {
    MainLayout
  }
}
</script>

<style>
/* Globalne style, jeśli potrzebne */
</style>
