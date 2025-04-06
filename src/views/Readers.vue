<template>
    <div>
      <h2>Readers Management</h2>
      <reader-form 
        @reader-added="handleReaderAdded"
        @reader-updated="handleReaderUpdated"
        :edit-reader="editReader"
        @cancel-edit="cancelEdit"
      />
      <readers-table
        :readers="paginatedReaders"
        @edit-reader="prepareEditReader"
        @delete-reader="handleDeleteReader"
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
        pageSize: 5
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
        const response = await fetch('/api/readers')
        this.readers = await response.json()
      },
      async handleReaderAdded(reader) {
        await fetch('/api/readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        })
        await this.fetchReaders()
        this.currentPage = 1
      },
      async handleReaderUpdated(reader) {
        await fetch(`/api/readers/${reader.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        })
        await this.fetchReaders()
        this.editReader = null
      },
      async handleDeleteReader(readerId) {
        await fetch(`/api/readers/${readerId}`, { method: 'DELETE' })
        await this.fetchReaders()
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1
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
  