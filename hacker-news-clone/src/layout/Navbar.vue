<template>
  <nav class="navbar">
    <router-link to="/" class="logo-container">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
      <span class="site-title">Hacker News</span>
    </router-link>
    <router-link to="/" class="nav-link" exact-active-class="active"
      >Home</router-link
    >
  </nav>
</template>

<script setup></script>

<style scoped>
.navbar {
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-container {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.site-title {
  color: white;
  font-size: 20px;
  font-weight: bold;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  padding: 8px 16px;
  border-radius: 5px;
  transition: background-color 0.3s, color 0.3s;
}

.nav-link:hover {
  background-color: #555;
}

.nav-link.active {
  color: white;
}
</style>
