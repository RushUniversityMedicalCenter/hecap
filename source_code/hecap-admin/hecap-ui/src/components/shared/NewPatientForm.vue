<template>
    <v-form v-model="formData" @submit.prevent="$emit('submit', formData)">
      <v-text-field label="Name" v-model="formData.name" required />
      <div class="d-flex justify-space-between mt-4">
        <v-btn color="primary" type="submit">Save</v-btn>
        <v-btn text color="secondary" @click="$emit('close')">Cancel</v-btn>
      </div>
    </v-form>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    formData: { type: Object, required: true } // Expect an object to hold form data
  });
  
  const emit = defineEmit(['submit', 'close']); // Define custom events for form submission and closing
  
  </script>