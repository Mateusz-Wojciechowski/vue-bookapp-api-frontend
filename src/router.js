import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/Home.vue'
import BooksView from './views/Books.vue'
import AuthorsView from './views/Authors.vue'
import LendingsView from './views/Lendings.vue'
import ReadersView from './views/Readers.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/books', name: 'Books', component: BooksView },
  { path: '/authors', name: 'Authors', component: AuthorsView },
  { path: '/readers', name: 'Readers', component: ReadersView },
  { path: '/lendings', name: 'Lendings', component: LendingsView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
