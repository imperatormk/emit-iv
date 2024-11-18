<template>
  <Navbar />
  <div class="container">
    <div class="page">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/layout/Navbar.vue";
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.container {
  display: flex;
  justify-content: center;

  .page {
    margin-top: 50px;
    width: 70%;
  }
}
</style>
