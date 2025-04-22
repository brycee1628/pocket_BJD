<script setup>
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="wrapper">
    <NavBar :paths="[
      { id: 0, pageName: '首頁', url: '/' },
    ]">
    </NavBar>
    <router-view></router-view>
    <Footer></Footer>
  </div>
</template>

<style>
:root {
  --tiffany-blue: #0abab5;
  --tiffany-green: #81d8d0;
  --tiffany-dark: #008080;
  --tiffany-accent: #4ebbb9;
  --light-gray: #f8f9fa;
  --dark-gray: #343a40;
  --tiffany-light: #e8f7f6;
  --black: #212529;
}

body {
  background-color: white;
  margin: 0;
  padding: 0;
}
</style>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
