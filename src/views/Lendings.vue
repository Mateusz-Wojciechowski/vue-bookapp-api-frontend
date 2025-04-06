<template>
    <div>
      <h2>Lendings Management</h2>
      <lending-form 
        @lending-added="handleLendingAdded"
        @lending-updated="handleLendingUpdated"
        :edit-lending="editLending"
        @cancel-edit="cancelEdit"
      />
      <lendings-table
        :lendings="paginatedLendings"
        @edit-lending="prepareEditLending"
        @delete-lending="handleDeleteLending"
      />
      <div>
        <button 
          v-for="page in totalPages" 
          :key="page" 
          @click="changePage(page)" 
          :disabled="page === currentPage"
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
        pageSize: 5
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
        const response = await fetch('/api/lendings')
        const data = await response.json()
        this.lendings = data
      },
      async handleLendingAdded(lending) {
        await fetch('/api/lendings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lending)
        })
        await this.fetchLendings()
        this.currentPage = 1
      },
      async handleLendingUpdated(lending) {
        await fetch(`/api/lendings/${lending.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(lending)
        })
        await this.fetchLendings()
        this.editLending = null
      },
      async handleDeleteLending(lendingId) {
        await fetch(`/api/lendings/${lendingId}`, { method: 'DELETE' })
        await this.fetchLendings()
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
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
  