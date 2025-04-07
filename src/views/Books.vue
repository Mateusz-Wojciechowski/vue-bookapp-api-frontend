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
    
    <!-- Komunikaty o błędach lub braku danych -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="books.length === 0" class="no-data-message">
      No books to display
    </div>
    
    <!-- Tabela z książkami wraz z paginacją -->
    <books-table
      v-else
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
      editBook: null,
      error: null
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
        this.error = null
        const response = await fetch('/api/books')
        
        if (response.status === 404) {
          const errorData = await response.json()
          this.error = errorData.message || 'Nie znaleziono zasobów (404)'
          this.books = []
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('Fetched books:', data)
        this.books = data
      } catch (error) {
        console.error('Error fetching books:', error)
        this.error = error.message || 'Wystąpił błąd podczas pobierania danych'
      }
    },
    async handleBookAdded(newBook) {
      try {
        this.error = null
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBook)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchBooks() // odświeżamy całą listę po dodaniu
        this.currentPage = 1 // powrót do pierwszej strony
      } catch (error) {
        console.error('Error adding book:', error)
        this.error = error.message || 'Wystąpił błąd podczas dodawania książki'
      }
    },
    prepareEditBook(book) {
      this.editBook = { ...book }
    },
    async handleBookUpdated(updatedBook) {
      try {
        this.error = null
        const response = await fetch(`/api/books/${updatedBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBook)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchBooks() // odświeżamy listę po edycji
        this.editBook = null
      } catch (error) {
        console.error('Error updating book:', error)
        this.error = error.message || 'Wystąpił błąd podczas aktualizacji książki'
      }
    },
    async handleDeleteBook(bookId) {
      try {
        this.error = null
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchBooks() // odświeżamy listę po usunięciu
        // Jeśli bieżąca strona przekracza liczbę stron, ustaw aktualną stronę na ostatnią
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
        }
      } catch (error) {
        console.error('Error deleting book:', error)
        this.error = error.message || 'Wystąpił błąd podczas usuwania książki'
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
.error-message {
  color: red;
  padding: 15px;
  margin: 15px 0;
  border: 1px solid red;
  border-radius: 4px;
  background-color: #ffeeee;
  text-align: center;
}

.no-data-message {
  padding: 15px;
  margin: 15px 0;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  text-align: center;
  font-style: italic;
}
</style>
