export const validateField = (field, value) => {
  const rules = field.validationRules || {};
  const fieldErrors = [];

  if (rules.required && (!value || (Array.isArray(value) && value.length === 0))) {
    fieldErrors.push(`${field.label} is required`);
  }

  if (value) {
    if (rules.minLength && value.length < rules.minLength) {
      fieldErrors.push(`${field.label} must be at least ${rules.minLength} characters`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      fieldErrors.push(`${field.label} must be no more than ${rules.maxLength} characters`);
    }

    if (rules.min && parseFloat(value) < rules.min) {
      fieldErrors.push(`${field.label} must be at least ${rules.min}`);
    }

    if (rules.max && parseFloat(value) > rules.max) {
      fieldErrors.push(`${field.label} must be no more than ${rules.max}`);
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      fieldErrors.push(`${field.label} format is invalid`);
    }
  }

  return fieldErrors;
};

export const isFieldVisible = (field, formData) => {
  if (!field.condition) return true;

  const conditionField = field.condition.field;
  const conditionValue = field.condition.value;
  const currentValue = formData[conditionField];

  if (Array.isArray(conditionValue)) {
    return conditionValue.includes(currentValue);
  }

  return currentValue === conditionValue;
};