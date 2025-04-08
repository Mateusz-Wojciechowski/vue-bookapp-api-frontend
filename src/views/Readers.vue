<template>
  <div>
    <h2>Readers Management</h2>
    <reader-form 
      @reader-added="handleReaderAdded"
      @reader-updated="handleReaderUpdated"
      :edit-reader="editReader"
      @cancel-edit="cancelEdit"
    />
    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="!readersPage || readersPage.content.length === 0" class="no-data-message">
      No readers to display
    </div>
    <readers-table 
      v-else
      :readers="readersPage.content"
      :current-page="currentPage"
      :total-pages="totalPages"
      @edit-reader="prepareEditReader"
      @delete-reader="handleDeleteReader"
      @change-page="changePage"
    />
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
      readersPage: null,
      currentPage: 1,
      pageSize: 5,
      editReader: null,
      error: null
    }
  },
  computed: {
    totalPages() {
      return this.readersPage ? this.readersPage.totalPages : 0;
    }
  },
  methods: {
    async fetchReaders() {
      try {
        this.error = null;
        const response = await fetch(`/api/readers?page=${this.currentPage - 1}&size=${this.pageSize}`);
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        this.readersPage = await response.json();
      } catch (error) {
        console.error('Error fetching readers:', error);
        this.error = error.message || 'Error fetching readers';
      }
    },
    async handleReaderAdded(reader) {
      try {
        this.error = null;
        const response = await fetch('/api/readers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        this.currentPage = 1;
        await this.fetchReaders();
      } catch (error) {
        console.error('Error adding reader:', error);
        this.error = error.message || 'Error adding reader';
      }
    },
    async handleReaderUpdated(reader) {
      try {
        this.error = null;
        const response = await fetch(`/api/readers/${reader.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reader)
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        await this.fetchReaders();
        this.editReader = null;
      } catch (error) {
        console.error('Error updating reader:', error);
        this.error = error.message || 'Error updating reader';
      }
    },
    async handleDeleteReader(readerId) {
      try {
        this.error = null;
        const response = await fetch(`/api/readers/${readerId}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Error ${response.status}`);
        }
        await this.fetchReaders();
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages || 1;
        }
      } catch (error) {
        console.error('Error deleting reader:', error);
        this.error = error.message || 'Error deleting reader';
      }
    },
    prepareEditReader(reader) {
      this.editReader = { ...reader };
    },
    async changePage(page) {
      this.currentPage = page;
      await this.fetchReaders();
    },
    cancelEdit() {
      this.editReader = null;
    }
  },
  mounted() {
    this.fetchReaders();
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
