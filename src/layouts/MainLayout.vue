<template>
  <div>
    <header class="header">
      <h1>Books Management</h1>
      <nav>
        <router-link to="/">Home</router-link> |  
        <router-link to="/books">Books</router-link> |  
        <router-link to="/authors">Authors</router-link> |
        <router-link to="/readers">Readers</router-link> |  
        <router-link to="/lendings">Lendings</router-link>
      </nav>
    </header>
    <main class="content">
      <slot></slot>
    </main>
    <footer class="footer">
      <p>&copy; 2025 - ZTW</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style scoped>
.header {
  background: blue;
  color: white;
  padding: 1rem;
}
.header h1 {
  color: white;
}
nav a {
  color: white;
  margin-right: 1rem;
  text-decoration: none;
}
.content {
  padding: 1rem;
}
.footer {
  background: #f0f0f0;
  text-align: center;
  padding: 0.5rem;
  margin-top: 2rem;
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
}
body {
  display: flex;
  flex-direction: column;
  height: 100vh
}
</style>
