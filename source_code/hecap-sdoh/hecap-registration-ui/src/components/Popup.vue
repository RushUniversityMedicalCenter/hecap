<template>
    <v-dialog :model-value="isOpen" @update:model-value="$emit('update:isOpen', $event)" 
              width="800">
      <v-card>
      <iframe
          :src="pdfUrl"
          width="100%"
          height="800"
          frameborder="0"
        ></iframe>
        <v-card-actions>
          <v-btn color="primary" @click="$emit('update:isOpen', false)">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    isOpen: boolean,
    pdfUrl: string
  }>()
  
  defineEmits<{
    (e: 'update:isOpen', value: boolean): void
  }>()
  </script>