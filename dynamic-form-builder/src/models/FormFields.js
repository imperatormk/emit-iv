export class FormField {
  constructor(id, label, type, conditional = null, validationRules = []) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.conditional = conditional;
    this.visible = true;
    this.validationRules = validationRules;
    this.error = null;
  }

  evaluateVisibility(formData) {
    if (!this.conditional) return true;
    const { field, value } = this.conditional;
    return formData[field] === value;
  }

  validate(value, formData) {
    for (const rule of this.validationRules) {
      const errorMessage = this.runValidationRule(rule, value, formData);
      if (errorMessage) {
        this.error = errorMessage;
        return false;
      }
    }
    this.error = null;
    return true;
  }

  runValidationRule(rule, value, formData) {
    const { type, value: ruleValue, message } = rule;
    switch (type) {
      case "required":
        return !value ? message || `${this.label} is required` : null;
      case "min":
        return value < ruleValue
          ? message || `${this.label} must be at least ${ruleValue}`
          : null;
      case "max":
        return value > ruleValue
          ? message || `${this.label} must not exceed ${ruleValue}`
          : null;
      case "equals":
        return value !== ruleValue
          ? message || `${this.label} must be equal to ${ruleValue}`
          : null;
      case "conditionalRequired":
        if (formData[rule.field] === ruleValue && !value) {
          return (
            message ||
            `${this.label} is required when ${rule.field} is ${ruleValue}`
          );
        }
        return null;
      default:
        throw new Error(`Unsupported validation rule: ${type}`);
    }
  }
}

export class TextField extends FormField {
  constructor(id, label, conditional, validationRules = []) {
    super(id, label, "text", conditional, validationRules);
    this.value = "";
  }
}

export class NumberField extends FormField {
  constructor(id, label, min, max, conditional, validationRules = []) {
    super(id, label, "number", conditional, validationRules);
    this.min = min;
    this.max = max;
    this.value = null;
  }
}

export class CheckboxField extends FormField {
  constructor(id, label, conditional, validationRules = []) {
    super(id, label, "checkbox", conditional, validationRules);
    this.checked = false;
  }
}

export class DropdownField extends FormField {
  constructor(id, label, options, conditional, validationRules = []) {
    super(id, label, "dropdown", conditional, validationRules);
    this.options = options;
    this.selected = null;
  }
}
