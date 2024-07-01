<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
</script>
<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="Test Users:"> 
                <div class="pa-7 pt-1"><li>UserAdmin01 </li></div>
                <div class="pa-7 pt-1"><li>UserOpt01 </li></div>
                <p>Please contact administrator for test user credentials.</p>
            </UiParentCard>
        </v-col>
    </v-row>
</template>
