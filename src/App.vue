<template>
  <div :class="['home-page', { collapsed: isCollapsed }]">
    <Header class="header"></Header>
    <Navbar class="navbar"></Navbar>
    <div class="content ms-4 mr-4">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Navbar from "./components/Navbar/Navbar.vue";
import { RouterView } from "vue-router";
import Header from "./components/Header/Header.vue";

const isCollapsed = ref(false);

</script>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.home-page {
  display: grid;
  grid-template-areas: "navbar header" "navbar content";
  grid-template-columns: 280px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  transition: all 0.3s ease; /* Thêm hiệu ứng chuyển tiếp */
}

/* Khi sidebar bị thu gọn */
.collapsed {
  grid-template-columns: 0 1fr; /* Chiếm toàn bộ không gian */
  margin-left: 0; /* Không gian bên trái */
}

.navbar {
  grid-area: navbar;
}

.header {
  grid-area: header;
}

.content {
  grid-area: content;
  overflow-x: hidden;
}
</style>
