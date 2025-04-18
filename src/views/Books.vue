<template>
  <div>
    <h2>Books Management</h2>
    <book-form 
      @book-added="handleBookAdded" 
      @book-updated="handleBookUpdated" 
      :edit-book="editBook" 
      @cancel-edit="cancelEdit" 
    />
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!booksPage || booksPage.content.length === 0" class="no-data-message">
      No books to display
    </div>
    <books-table 
      v-else
      :books="booksContent" 
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
  components: { BookForm, BooksTable },
  data() {
    return {
      booksPage: null,
      currentPage: 1,
      pageSize: 5,
      editBook: null,
      error: null
    }
  },
  computed: {
    booksContent() {
      return this.booksPage ? this.booksPage.content : [];
    },
    totalPages() {
      return this.booksPage ? this.booksPage.totalPages : 0;
    }
  },
  methods: {
    async fetchBooks() {
      try {
        this.error = null;
        const response = await fetch(`/api/books?page=${this.currentPage - 1}&size=${this.pageSize}`);
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        this.booksPage = await response.json();
        console.log('Books page:', this.booksPage);

        console.log('Liczba rekordów na stronie:', this.booksPage.content.length);

        console.log('Total pages:', this.booksPage.totalPages);
      } catch (error) {
        console.error('Error fetching books:', error);
        this.error = error.message || 'Error fetching books';
      }
    },
    async handleBookAdded(newBook) {
      try {
        this.error = null;
        const response = await fetch('/api/books', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBook)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        this.currentPage = 1;
        await this.fetchBooks();
      } catch (error) {
        console.error('Error adding book:', error);
        this.error = error.message || 'Error adding book';
      }
    },
    prepareEditBook(book) {
      this.editBook = { ...book };
    },
    async handleBookUpdated(updatedBook) {
      try {
        this.error = null;
        const response = await fetch(`/api/books/${updatedBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedBook)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        await this.fetchBooks();
        this.editBook = null;
      } catch (error) {
        console.error('Error updating book:', error);
        this.error = error.message || 'Error updating book';
      }
    },
    async handleDeleteBook(bookId) {
      try {
        this.error = null;
        const response = await fetch(`/api/books/${bookId}`, {
          method: 'DELETE'
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        await this.fetchBooks();
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      } catch (error) {
        console.error('Error deleting book:', error);
        this.error = error.message || 'Error deleting book';
      }
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchBooks();
    },
    cancelEdit() {
      this.editBook = null;
    }
  },
  mounted() {
    this.fetchBooks();
  }
}
</script>

<style scoped>
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
