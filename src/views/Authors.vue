<template>
  <div>
    <h2>Authors Management</h2>
    <author-form 
      @author-added="handleAuthorAdded"
      @author-updated="handleAuthorUpdated"
      :edit-author="editAuthor"
      @cancel-edit="cancelEdit"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!authorsPage || authorsPage.content.length === 0" class="no-data-message">
      No authors to display
    </div>
    <authors-table 
      v-else
      :authors="authorsPage.content"
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
  components: { AuthorForm, AuthorsTable },
  data() {
    return {
      authorsPage: null,
      currentPage: 1,
      pageSize: 5,
      editAuthor: null,
      error: null
    }
  },
  computed: {
    totalPages() {
      return this.authorsPage ? this.authorsPage.totalPages : 0;
    }
  },
  methods: {
    async fetchAuthors() {
      try {
        this.error = null;
        const response = await fetch(`/api/authors?page=${this.currentPage - 1}&size=${this.pageSize}`);
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        this.authorsPage = await response.json();
      } catch (error) {
        console.error('Error fetching authors:', error);
        this.error = error.message
      }
    },
    async handleAuthorAdded(newAuthor) {
      try {
        this.error = null;
        const response = await fetch('/api/authors', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAuthor)
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message === "Database connection error") {
            throw new Error(errorData.message || `Error ${response.status}`);
          }else{
            alert(errorData.message)
          }
        }
        this.currentPage = 1;
        await this.fetchAuthors();
      } catch (error) {
        console.error('Error adding author:', error);
        this.error = error.message || 'Error adding author';
      }
    },
    async handleAuthorUpdated(updatedAuthor) {
      try {
        this.error = null;
        const response = await fetch(`/api/authors/${updatedAuthor.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAuthor)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        await this.fetchAuthors();
        this.editAuthor = null;
      } catch (error) {
        console.error('Error updating author:', error);
        this.error = error.message || 'Error updating author';
      }
    },
    async handleDeleteAuthor(authorId) {
      try {
        this.error = null;
        const response = await fetch(`/api/authors/${authorId}`, {
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
        await this.fetchAuthors();
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      } catch (error) {
        console.error('Error deleting author:', error);
        this.error = error.message || 'Error deleting author';
      }
    },
    prepareEditAuthor(author) {
      this.editAuthor = { ...author };
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchAuthors();
    },
    cancelEdit() {
      this.editAuthor = null;
    }
  },
  mounted() {
    this.fetchAuthors();
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
