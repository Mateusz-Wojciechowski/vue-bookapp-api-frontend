import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import BooksView from './views/Books.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/books', name: 'Books', component: BooksView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
