<template>
    <div>
      <h3>{{ formTitle }}</h3>
      <form @submit.prevent="handleSubmit">
        <div>
          <label>Name:</label>
          <input v-model="reader.name" type="text" required />
        </div>
        <button type="submit">{{ submitButtonText }}</button>
        <button type="button" v-if="isEditing" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReaderForm',
    props: {
      editReader: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        reader: {
          id: null,
          name: ''
        }
      }
    },
    computed: {
      isEditing() {
        return this.editReader !== null;
      },
      formTitle() {
        return this.isEditing ? 'Edit Reader' : 'Add New Reader';
      },
      submitButtonText() {
        return this.isEditing ? 'Update Reader' : 'Add Reader';
      }
    },
    watch: {
      editReader: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.reader = { ...newVal };
          } else {
            this.resetForm();
          }
        }
      }
    },
    methods: {
      resetForm() {
        this.reader = {
          id: null,
          name: ''
        };
      },
      handleSubmit() {
        if (this.isEditing) {
          this.$emit('reader-updated', this.reader);
        } else {
          this.$emit('reader-added', this.reader);
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