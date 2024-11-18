<template>
  <div class="form-builder-container">
    <form @submit.prevent="handleSubmit" class="form-builder">
      <div
        v-for="field in formBuilder.fields.filter((field) => field.visible)"
        :key="field.id"
        class="form-field-container"
      >
        <label :for="field.id">{{ field.label }}</label>

        <template v-if="field.type === 'text'">
          <input
            type="text"
            :id="field.id"
            class="form-field"
            v-model="formBuilder.formData[field.id]"
            @input="handleInputChange(field)"
          />
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>

        <template v-if="field.type === 'number'">
          <input
            type="number"
            :id="field.id"
            class="form-field"
            v-model="formBuilder.formData[field.id]"
            @input="handleInputChange(field)"
          />
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>

        <template v-if="field.type === 'checkbox'">
          <input
            type="checkbox"
            :id="field.id"
            class="form-field"
            v-model="formBuilder.formData[field.id]"
            @change="handleInputChange(field)"
          />
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>

        <template v-if="field.type === 'dropdown'">
          <select
            :id="field.id"
            class="form-field"
            v-model="formBuilder.formData[field.id]"
            @change="handleInputChange(field)"
          >
            <option value="" disabled>Select an option</option>
            <option
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <div v-if="field.error" class="error">{{ field.error }}</div>
        </template>
      </div>

      <button type="submit" class="form-submit-button">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from "vue";

import { FormBuilder } from "@/models/FormBuilder";

const props = defineProps({
  schema: Object,
});
const emit = defineEmits(["submit"]);

const formBuilder = reactive(new FormBuilder(props.schema));

const handleInputChange = (field) => {
  formBuilder.updateFieldValue(field.id, formBuilder.formData[field.id]);
};

const handleSubmit = () => {
  if (formBuilder.validateForm()) {
    const formData = formBuilder.submitFormData();
    emit("submit", formData);
  }
};
</script>

<style lang="scss" scoped>
.form-builder-container {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.form-builder {
  width: 100%;
  max-width: 500px;
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
}

.form-field-container {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-field {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

input[type="checkbox"],
input[type="radio"] {
  width: auto;
  margin-right: 10px;
}

select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
}

.error {
  color: red;
  margin-top: 5px;
}

.form-submit-button {
  width: 100%;
  padding: 10px;
  color: white;
  border: none;
  border-radius: 4px;
}
</style>
