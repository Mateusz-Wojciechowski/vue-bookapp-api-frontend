<template>
  <div>
    <h2>Readers Management</h2>
    
    <!-- Formularz do dodawania/edycji czytelnika -->
    <reader-form
      @reader-added="handleReaderAdded"
      @reader-updated="handleReaderUpdated"
      :edit-reader="editReader"
      @cancel-edit="cancelEdit"
    />
    
    <!-- Komunikaty o błędach lub braku danych -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="readers.length === 0" class="no-data-message">
      No readers to display
    </div>
    
    <!-- Tabela z czytelnikami -->
    <readers-table
      v-else
      :readers="paginatedReaders"
      @edit-reader="prepareEditReader"
      @delete-reader="handleDeleteReader"
    />
    
    <!-- Paginacja -->
    <div v-if="readers.length > 0" class="pagination">
      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :disabled="page === currentPage"
        class="page-button"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
import ReaderForm from '@/components/ReaderForm.vue'
import ReadersTable from '@/components/ReadersTable.vue'

export default {
  name: 'ReadersView',
  components: { ReaderForm, ReadersTable },
  data() {
    return {
      readers: [],
      editReader: null,
      currentPage: 1,
      pageSize: 5,
      error: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.readers.length / this.pageSize)
    },
    paginatedReaders() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.readers.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchReaders() {
      try {
        this.error = null
        const response = await fetch('/api/readers')
        
        if (response.status === 404) {
          const errorData = await response.json()
          this.error = errorData.message || 'Nie znaleziono zasobów (404)'
          this.readers = []
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.readers = data
      } catch (error) {
        console.error('Error fetching readers:', error)
        this.error = error.message || 'Wystąpił błąd podczas pobierania danych'
      }
    },
    async handleReaderAdded(reader) {
      try {
        this.error = null
        const response = await fetch('/api/readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchReaders()
        this.currentPage = 1
      } catch (error) {
        console.error('Error adding reader:', error)
        this.error = error.message || 'Wystąpił błąd podczas dodawania czytelnika'
      }
    },
    async handleReaderUpdated(reader) {
      try {
        this.error = null
        const response = await fetch(`/api/readers/${reader.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchReaders()
        this.editReader = null
      } catch (error) {
        console.error('Error updating reader:', error)
        this.error = error.message || 'Wystąpił błąd podczas aktualizacji czytelnika'
      }
    },
    async handleDeleteReader(readerId) {
      try {
        this.error = null
        const response = await fetch(`/api/readers/${readerId}`, { 
          method: 'DELETE' 
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchReaders()
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
        }
      } catch (error) {
        console.error('Error deleting reader:', error)
        this.error = error.message || 'Wystąpił błąd podczas usuwania czytelnika'
      }
    },
    prepareEditReader(reader) {
      this.editReader = { ...reader }
    },
    cancelEdit() {
      this.editReader = null
    },
    changePage(page) {
      this.currentPage = page
    }
  },
  mounted() {
    this.fetchReaders()
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

.pagination {
  margin-top: 20px;
  text-align: center;
}

.page-button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.page-button[disabled] {
  background-color: #eee;
  cursor: not-allowed;
}
</style>
  