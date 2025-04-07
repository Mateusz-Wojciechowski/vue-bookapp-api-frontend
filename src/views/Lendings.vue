<template>
  <div>
    <h2>Lendings Management</h2>
    
    <!-- Formularz do dodawania/edycji wypożyczenia -->
    <lending-form
      @lending-added="handleLendingAdded"
      :edit-lending="editLending"
      @cancel-edit="cancelEdit"
    />
    
    <!-- Komunikaty o błędach lub braku danych -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
    
    <div v-else-if="lendings.length === 0" class="no-data-message">
      No lendings to display
    </div>
    
    <!-- Tabela z wypożyczeniami -->
    <lendings-table
      v-else
      :lendings="paginatedLendings"
      @edit-lending="prepareEditLending"
      @delete-lending="handleDeleteLending"
    />
    
    <!-- Paginacja -->
    <div v-if="lendings.length > 0" class="pagination">
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
import LendingForm from '@/components/LendingForm.vue'
import LendingsTable from '@/components/LendingsTable.vue'

export default {
  name: 'LendingsView',
  components: { LendingForm, LendingsTable },
  data() {
    return {
      lendings: [],
      editLending: null,
      currentPage: 1,
      pageSize: 5,
      error: null
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.lendings.length / this.pageSize)
    },
    paginatedLendings() {
      const start = (this.currentPage - 1) * this.pageSize
      return this.lendings.slice(start, start + this.pageSize)
    }
  },
  methods: {
    async fetchLendings() {
      try {
        this.error = null
        const response = await fetch('/api/lendings')
        
        if (response.status === 404) {
          const errorData = await response.json()
          this.error = errorData.message || 'Nie znaleziono zasobów (404)'
          this.lendings = []
          return
        }
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        this.lendings = data
      } catch (error) {
        console.error('Error fetching lendings:', error)
        this.error = error.message || 'Wystąpił błąd podczas pobierania danych'
      }
    },
    async handleLendingAdded(lending) {
      try {
        this.error = null
        
        // Najpierw pobierz obiekt Reader na podstawie ID
        const readerResponse = await fetch(`/api/readers/${lending.reader.id}`);
        
        if (!readerResponse.ok) {
          throw new Error(`Error fetching reader: ${readerResponse.status}`);
        }
        
        const reader = await readerResponse.json();
        console.log(reader)
        console.log(lending.book.id)
        
        // Teraz wyślij żądanie wypożyczenia z obiektem Reader
        const response = await fetch(`/api/lendings/lend?bookId=${lending.book.id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        
        await this.fetchLendings();
        this.currentPage = 1;
      } catch (error) {
        console.error('Error adding lending:', error);
        this.error = error.message || 'Wystąpił błąd podczas dodawania wypożyczenia';
      }
    },
    async handleDeleteLending(lendingId) {
      try {
        this.error = null
        const response = await fetch(`/api/lendings/return?lendingId=${lendingId}`, { 
          method: 'POST' 
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `Error ${response.status}`)
        }
        
        await this.fetchLendings()
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
        }
      } catch (error) {
        console.error('Error deleting lending:', error)
        this.error = error.message || 'Wystąpił błąd podczas usuwania wypożyczenia'
      }
    },
    prepareEditLending(lending) {
      this.editLending = { ...lending }
    },
    cancelEdit() {
      this.editLending = null
    },
    changePage(page) {
      this.currentPage = page
    }
  },
  mounted() {
    this.fetchLendings()
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