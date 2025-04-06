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
      <!-- Tabela z autorami wraz z paginacją -->
      <authors-table
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
        editAuthor: null
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
          const response = await fetch('/api/authors')
          const data = await response.json()
          this.authors = data
        } catch (error) {
          console.error('Error fetching authors:', error)
        }
      },
      async handleAuthorAdded(newAuthor) {
        try {
          const response = await fetch('/api/authors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAuthor)
          })
          if (response.ok) {
            await this.fetchAuthors()
            this.currentPage = 1
          }
        } catch (error) {
          console.error('Error adding author:', error)
        }
      },
      prepareEditAuthor(author) {
        this.editAuthor = { ...author }
      },
      async handleAuthorUpdated(updatedAuthor) {
        try {
          const response = await fetch(`/api/authors/${updatedAuthor.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedAuthor)
          })
          if (response.ok) {
            await this.fetchAuthors()
            this.editAuthor = null
          }
        } catch (error) {
          console.error('Error updating author:', error)
        }
      },
      async handleDeleteAuthor(authorId) {
        try {
          const response = await fetch(`/api/authors/${authorId}`, {
            method: 'DELETE'
          })
          if (response.ok) {
            await this.fetchAuthors()
            if (this.currentPage > this.totalPages) {
              this.currentPage = this.totalPages || 1
            }
          }
        } catch (error) {
          console.error('Error deleting author:', error)
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
  </style>