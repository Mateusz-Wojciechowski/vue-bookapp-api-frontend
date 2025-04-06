<template>
  <div>
    <h2>Books Management</h2>
    <!-- Formularz do dodawania/edycji książki -->
    <book-form 
      @book-added="handleBookAdded" 
      @book-updated="handleBookUpdated" 
      :edit-book="editBook" 
      @cancel-edit="cancelEdit" 
    />
    <!-- Tabela z książkami wraz z paginacją -->
    <books-table 
      :books="paginatedBooks" 
      :current-page="currentPage" 
      :total-pages="totalPages" 
      @edit-book="prepareEditBook" 
      @delete-book="handleDeleteBook" 
      @change-page="changePage"
    />
  </div>
</template>

<script>
import BookForm from '@/components/BookForm.vue'
import BooksTable from '@/components/BooksTable.vue'

export default {
  name: 'BooksView',
  components: {
    BookForm,
    BooksTable
  },
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 5, // Liczba książek wyświetlanych na jednej stronie
      editBook: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.books.length / this.pageSize)
    },
    paginatedBooks() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.books.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchBooks() {
      try {
        const response = await fetch('/api/books')
        const data = await response.json()
        console.log('Fetched books:', data)
        this.books = data
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    },
    async handleBookAdded(newBook) {
      try {
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBook)
        })
        if (response.ok) {
          await this.fetchBooks() // odświeżamy całą listę po dodaniu
          this.currentPage = 1 // powrót do pierwszej strony
        }
      } catch (error) {
        console.error('Error adding book:', error)
      }
    },
    prepareEditBook(book) {
      this.editBook = { ...book }
    },
    async handleBookUpdated(updatedBook) {
      try {
        const response = await fetch(`/api/books/${updatedBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBook)
        })
        if (response.ok) {
          await this.fetchBooks() // odświeżamy listę po edycji
          this.editBook = null
        }
      } catch (error) {
        console.error('Error updating book:', error)
      }
    },
    async handleDeleteBook(bookId) {
      try {
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          await this.fetchBooks() // odświeżamy listę po usunięciu
          // Jeśli bieżąca strona przekracza liczbę stron, ustaw aktualną stronę na ostatnią
          if (this.currentPage > this.totalPages) {
            this.currentPage = this.totalPages || 1
          }
        }
      } catch (error) {
        console.error('Error deleting book:', error)
      }
    },
    changePage(page) {
      this.currentPage = page
    },
    cancelEdit() {
      this.editBook = null
    }
  },
  mounted() {
    this.fetchBooks()
  }
}
</script>

<style scoped>
/* Dodatkowe style, jeśli potrzebne */
</style>
