<template>
  <div class="app-container">
    <header class="app-header">
      <h1>Rema 1000 Departments</h1>
    </header>
    
    <main class="app-main">
      <NuxtPage />
    </main>
    
    <footer class="app-footer">
      <p>&copy; {{ new Date().getFullYear() }} Rema 1000 Departments</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app-header {
  background-color: #e30613;  /* Rema 1000 red color */
  color: white;
  padding: 15px;
  text-align: center;
  border-radius: 8px;
  margin-bottom: 20px;
}

.app-main {
  flex-grow: 1;
}

.app-footer {
  text-align: center;
  padding: 15px;
  background-color: #f4f4f4;
  border-radius: 8px;
  margin-top: 20px;
  color: #666;
}
</style>