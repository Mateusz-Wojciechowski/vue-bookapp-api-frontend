<template>
    <div>
      <h3>{{ formTitle }}</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Book:</label>
          <select v-model.number="lending.bookId" required>
            <option disabled value="0">Select a book</option>
            <option v-for="book in books" :key="book.id" :value="book.id">
              {{ book.title }}
            </option>
          </select>
        </div>
        <div>
          <label>Reader:</label>
          <select v-model.number="lending.readerId" required>
            <option disabled value="0">Select a reader</option>
            <option v-for="reader in readers" :key="reader.id" :value="reader.id">
              {{ reader.name }}
            </option>
          </select>
        </div>
        <button type="submit">{{ submitButtonText }}</button>
        <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LendingForm',
    props: {
      editLending: { type: Object, default: null }
    },
    data() {
      return {
        lending: {
          id: null,
          bookId: 0,
          readerId: 0,
          lendingDate: ''
        },
        books: [],
        readers: []
      }
    },
    computed: {
      isEditing() {
        return this.editLending !== null;
      },
      formTitle() {
        return this.isEditing ? 'Edit Lending' : 'Add New Lending';
      },
      submitButtonText() {
        return this.isEditing ? 'Update Lending' : 'Add Lending';
      }
    },
    watch: {
      editLending: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.lending = {
              id: newVal.id,
              bookId: newVal.book?.id || 0,
              readerId: newVal.reader?.id || 0,
              lendingDate: newVal.lendingDate
            }
          } else {
            this.resetForm();
          }
        }
      }
    },
    mounted() {
      this.fetchBooks();
      this.fetchReaders();
    },
    methods: {
      async fetchBooks() {
        const response = await fetch('/api/books');
        this.books = await response.json();
      },
      async fetchReaders() {
        const response = await fetch('/api/readers');
        this.readers = await response.json();
      },
      resetForm() {
        this.lending = {
          id: null,
          bookId: 0,
          readerId: 0,
          lendingDate: ''
        };
      },
      handleSubmit() {
        if (!this.lending.bookId || !this.lending.readerId) {
          alert('Select both book and reader.');
          return;
        }
        const payload = {
          id: this.lending.id,
          lendingDate: this.lending.lendingDate,
          book: { id: this.lending.bookId },
          reader: { id: this.lending.readerId }
        }
        this.$emit(this.isEditing ? 'lending-updated' : 'lending-added', payload);
        this.resetForm();
      },
      cancelEdit() {
        this.resetForm();
        this.$emit('cancel-edit');
      }
    }
  }
  </script>
  
  <style scoped>
  label {
    display: inline-block;
    width: 100px;
  }
  input, select {
    width: 200px;
    padding: 0.5rem;
  }
  form > div {
    margin-bottom: 1rem;
  }
  </style>