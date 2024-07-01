<script setup lang="ts">
import UiParentCard from '@/components/shared/UiParentCard.vue';
import CandidateList from "@/components/qualtrics/CandidateList.vue";

</script>

<template>
    <v-row>
        <v-col cols="12" md="12">
        <UiParentCard title="Qualtrics Candidates">
            <CandidateList/>
        </UiParentCard>
        </v-col>
    </v-row>
</template>
