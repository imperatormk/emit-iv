<template>
  <div>
    <h1>Participant Survey</h1>
    <FormBuilder :schema="schema" @submit="handleSubmission" />
    <template v-if="formData">
      <br />
      <hr />
      <br />
      <pre>{{ formData }}</pre>
    </template>
  </div>
</template>

<script setup>
import { ref } from "vue";

import schema from "@/data/schema.json";
import FormBuilder from "@/components/FormBuilder.vue";

const formData = ref(null);
const handleSubmission = (submission) => {
  formData.value = submission;
  console.log("Form submitted:", submission);
};
</script>
