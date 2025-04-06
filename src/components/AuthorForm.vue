<template>
    <div>
      <h3>{{ formTitle }}</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Name:</label>
          <input v-model="author.name" type="text" required />
        </div>
        <button type="submit">{{ submitButtonText }}</button>
        <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AuthorForm',
    props: {
      editAuthor: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        author: {
          id: null,
          name: ''
        }
      }
    },
    computed: {
      isEditing() {
        return this.editAuthor !== null;
      },
      formTitle() {
        return this.isEditing ? 'Edit Author' : 'Add New Author';
      },
      submitButtonText() {
        return this.isEditing ? 'Update Author' : 'Add Author';
      }
    },
    watch: {
      editAuthor: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.author = { ...newVal };
          } else {
            this.resetForm();
          }
        }
      }
    },
    methods: {
      resetForm() {
        this.author = {
          id: null,
          name: ''
        }
      },
      handleSubmit() {
        const payload = {
          id: this.author.id,
          name: this.author.name
        };
        if (this.isEditing) {
          this.$emit('author-updated', payload);
        } else {
          this.$emit('author-added', payload);
        }
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
  form {
    margin-bottom: 2rem;
  }
  div {
    margin-bottom: 1rem;
  }
  label {
    display: inline-block;
    width: 100px;
  }
  input {
    padding: 0.5rem;
    width: 200px;
  }
  button {
    margin-right: 0.5rem;
  }
  </style>