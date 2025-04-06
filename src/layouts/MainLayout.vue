<template>
  <div>
    <header class="header">
      <h1>Books Management</h1>
      <nav>
        <router-link to="/">Home</router-link> |
        <router-link to="/books">Books</router-link>
      </nav>
    </header>
    <main class="content">
      <slot></slot>
    </main>
    <footer class="footer">
      <p>&copy; 2020 - ZPR PWr</p>
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
  background: #009435;
  color: white;
  padding: 1rem;
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
</style>
