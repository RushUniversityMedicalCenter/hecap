<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import CandidateList from '@/components/c24/UserList.vue';

</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
        <UiParentCard title="C24 Users">
            <CandidateList/>
        </UiParentCard>
        </v-col >
    </v-row>
</template>
