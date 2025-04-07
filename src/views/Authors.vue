<template>
  <div>
    <h2>Authors Management</h2>
    <!-- Formularz do dodawania/edycji autora -->
    <author-form
      @author-added="handleAuthorAdded"
      @author-updated="handleAuthorUpdated"
      :edit-author="editAuthor"
      @cancel-edit="cancelEdit"
    />
    
    <!-- Komunikaty o błędach lub braku danych -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="authors.length === 0" class="no-data-message">
      No authors to display
    </div>
    
    <!-- Tabela z autorami wraz z paginacją -->
    <authors-table
      v-else
      :authors="paginatedAuthors"
      :current-page="currentPage"
      :total-pages="totalPages"
      @edit-author="prepareEditAuthor"
      @delete-author="handleDeleteAuthor"
      @change-page="changePage"
    />
  </div>
</template>

<script>
import AuthorForm from '@/components/AuthorForm.vue'
import AuthorsTable from '@/components/AuthorsTable.vue'

export default {
  name: 'AuthorsView',
  components: {
    AuthorForm,
    AuthorsTable
  },
  data() {
    return {
      authors: [],
      currentPage: 1,
      pageSize: 5,
      editAuthor: null,
      error: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.authors.length / this.pageSize)
    },
    paginatedAuthors() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.authors.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchAuthors() {
      try {
        this.error = null
        const response = await fetch('/api/authors')
        
        if (response.status === 404) {
          const errorData = await response.json()
          this.error = errorData.message || 'Nie znaleziono zasobów (404)'
          this.authors = []
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.authors = data
      } catch (error) {
        console.error('Error fetching authors:', error)
        this.error = error.message || 'Wystąpił błąd podczas pobierania danych'
      }
    },
    async handleAuthorAdded(newAuthor) {
      try {
        this.error = null
        const response = await fetch('/api/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAuthor)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchAuthors()
        this.currentPage = 1
      } catch (error) {
        console.error('Error adding author:', error)
        this.error = error.message || 'Wystąpił błąd podczas dodawania autora'
      }
    },
    prepareEditAuthor(author) {
      this.editAuthor = { ...author }
    },
    async handleAuthorUpdated(updatedAuthor) {
      try {
        this.error = null
        const response = await fetch(`/api/authors/${updatedAuthor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAuthor)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchAuthors()
        this.editAuthor = null
      } catch (error) {
        console.error('Error updating author:', error)
        this.error = error.message || 'Wystąpił błąd podczas aktualizacji autora'
      }
    },
    async handleDeleteAuthor(authorId) {
      try {
        this.error = null
        const response = await fetch(`/api/authors/${authorId}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchAuthors()
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
        }
      } catch (error) {
        console.error('Error deleting author:', error)
        this.error = error.message || 'Wystąpił błąd podczas usuwania autora'
      }
    },
    changePage(page) {
      this.currentPage = page
    },
    cancelEdit() {
      this.editAuthor = null
    }
  },
  mounted() {
    this.fetchAuthors()
  }
}
</script>

<style scoped>
/* Style opcjonalne */
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