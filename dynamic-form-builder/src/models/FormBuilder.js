import * as FormFields from "./FormFields";

export class FormBuilder {
  constructor(schema) {
    this.schema = schema;
    this.fields = this.buildFields(schema.fields);
    this.formData = this.initializeFormData();
    this.submitted = false;

    this.evaluateFieldVisibility();
  }

  buildFields(fieldsSchema) {
    return fieldsSchema.map((fieldSchema) => {
      const {
        id,
        label,
        type,
        conditional,
        validationRules = [],
      } = fieldSchema;
      switch (type) {
        case "text":
          return new FormFields.TextField(
            id,
            label,
            conditional,
            validationRules
          );
        case "number":
          return new FormFields.NumberField(
            id,
            label,
            fieldSchema.min,
            fieldSchema.max,
            conditional,
            validationRules
          );
        case "checkbox":
          return new FormFields.CheckboxField(
            id,
            label,
            conditional,
            validationRules
          );
        case "dropdown":
          return new FormFields.DropdownField(
            id,
            label,
            fieldSchema.options,
            conditional,
            validationRules
          );
        default:
          throw new Error(`Unsupported field type: ${type}`);
      }
    });
  }

  initializeFormData() {
    const formData = {};
    this.fields
      .filter((field) => field.visible)
      .forEach((field) => {
        if (field.type === "text") {
          formData[field.id] = "";
        } else if (field.type === "number") {
          formData[field.id] = null;
        } else if (field.type === "checkbox") {
          formData[field.id] = false;
        } else if (field.type === "dropdown") {
          formData[field.id] = null;
        }
      });
    return formData;
  }

  evaluateFieldVisibility() {
    this.fields.forEach((field) => {
      field.visible = field.evaluateVisibility(this.formData);
    });
  }

  updateFieldValue(fieldId, value) {
    this.formData[fieldId] = value;

    if (this.submitted) {
      const field = this.fields.find((f) => f.id === fieldId);
      if (field) field.validate(value, this.formData);
    }

    this.evaluateFieldVisibility();
  }

  validateForm() {
    this.submitted = true;
    return this.fields
      .filter((field) => field.visible)
      .map((field) => field.validate(this.formData[field.id], this.formData))
      .every((isValid) => isValid);
  }

  submitFormData() {
    return Object.fromEntries(
      this.fields
        .filter((field) => field.visible)
        .map((field) => [field.id, this.formData[field.id]])
    );
  }
}
