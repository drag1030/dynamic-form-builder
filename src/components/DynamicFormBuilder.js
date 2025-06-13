
// import { employeeSchema } from '../schemas/employeeSchema';
// import { surveySchema } from '../schemas/surveySchema';
// import { validateField, isFieldVisible } from '../utils/validation';

// const schemas = {
//   employee: employeeSchema,
//   survey: surveySchema
// };

import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { employeeSchema } from '../schemas/employeeSchema';
import { surveySchema } from '../schemas/surveySchema';

const DynamicFormBuilder = () => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showSchema, setShowSchema] = useState(true);
  const [currentSchema, setCurrentSchema] = useState('employee');

  // Schemas object
  const schemas = {
    employee: employeeSchema,
    survey: surveySchema
  };

  // Validation functions
  const validateField = (field, value) => {
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

  // Check if field should be visible based on conditions
  const isFieldVisible = (field) => {
    if (!field.condition) return true;

    const conditionField = field.condition.field;
    const conditionValue = field.condition.value;
    const currentValue = formData[conditionField];

    if (Array.isArray(conditionValue)) {
      return conditionValue.includes(currentValue);
    }

    return currentValue === conditionValue;
  };

  // Handle form field changes
  const handleFieldChange = (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);

    // Clear dependent fields when condition changes
    const schema = schemas[currentSchema];
    const dependentFields = schema.fields.filter(field => 
      field.condition && field.condition.field === fieldName
    );

    dependentFields.forEach(depField => {
      if (!isFieldVisible(depField)) {
        delete newFormData[depField.name];
        setFormData({ ...newFormData });
      }
    });

    // Validate field
    const field = schema.fields.find(f => f.name === fieldName);
    if (field) {
      const fieldErrors = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [fieldName]: fieldErrors
      }));
    }
  };

  // Handle form submission
//   const handleSubmit = () => {
//     const schema = schemas[currentSchema];
//     const newErrors = {};
//     let hasErrors = false;

//     // Validate all visible fields
//     schema.fields.forEach(field => {
//       if (isFieldVisible(field)) {
//         const fieldErrors = validateField(field, formData[field.name]);
//         if (fieldErrors.length > 0) {
//           newErrors[field.name] = fieldErrors;
//           hasErrors = true;
//         }
//       }
//     });

//     setErrors(newErrors);

//     if (!hasErrors) {
//       alert('Form submitted successfully!\n\nForm Data:\n' + JSON.stringify(formData, null, 2));
//     }
//   };
const handleSubmit = () => {
  const schema = schemas[currentSchema]; // employee or survey
  const visibleFields = schema.fields.filter(isFieldVisible).map(f => f.name);

  // Filter formData to include only visible fields
  const filteredData = Object.fromEntries(
    Object.entries(formData).filter(([key]) => visibleFields.includes(key))
  );

  try {
    // Zod validation
    schema.zodSchema.parse(filteredData);

    // If valid, show alert with form data
    alert('Form submitted successfully!\n\n' + JSON.stringify(filteredData, null, 2));
    setErrors({});
  } catch (err) {
    if (err.errors) {
      const zodErrors = {};
      err.errors.forEach(e => {
        const field = e.path[0];
        if (!zodErrors[field]) {
          zodErrors[field] = [];
        }
        zodErrors[field].push(e.message);
      });
      setErrors(zodErrors);
    }
  }
};


  // Reset form
  const resetForm = () => {
    setFormData({});
    setErrors({});
  };

  // Switch schema
  const switchSchema = (schemaKey) => {
    setCurrentSchema(schemaKey);
    resetForm();
  };

  // Render different input types
  const renderField = (field) => {
    const hasError = errors[field.name] && errors[field.name].length > 0;
    const fieldValue = formData[field.name] || '';

    const baseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={baseClasses}
            min={field.validationRules?.min}
            max={field.validationRules?.max}
          />
        );

      case 'select':
        return (
          <select
            id={field.name}
            name={field.name}
            value={fieldValue}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={baseClasses}
          >
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.name}
                  value={option.value}
                  checked={fieldValue === option.value}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        const checkboxValue = Array.isArray(fieldValue) ? fieldValue : [];
        return (
          <div className="space-y-2">
            {field.options.map(option => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={checkboxValue.includes(option.value)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...checkboxValue, option.value]
                      : checkboxValue.filter(v => v !== option.value);
                    handleFieldChange(field.name, newValue);
                  }}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const currentSchemaData = schemas[currentSchema];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dynamic Form Builder
          </h1>
          <p className="text-gray-600">
            Advanced form generation with conditional logic and real-time validation
          </p>
        </div>

        {/* Schema Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Form Templates</h2>
            <button
              onClick={() => setShowSchema(!showSchema)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              {showSchema ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{showSchema ? 'Hide' : 'Show'} Schema</span>
            </button>
          </div>
          
          <div className="flex space-x-4 mb-4">
            {Object.keys(schemas).map(schemaKey => (
              <button
                key={schemaKey}
                onClick={() => switchSchema(schemaKey)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  currentSchema === schemaKey
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {schemas[schemaKey].title}
              </button>
            ))}
          </div>

          {showSchema && (
            <div className="bg-gray-50 rounded-md p-4">
              <h3 className="font-medium text-gray-800 mb-2">Current Schema Structure:</h3>
              <pre className="text-sm text-gray-600 overflow-x-auto">
                {JSON.stringify(currentSchemaData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Dynamic Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentSchemaData.title}
            </h2>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset Form
            </button>
          </div>

          <div className="space-y-6">
            {currentSchemaData.fields
              .filter(field => isFieldVisible(field))
              .map(field => (
                <div key={field.name} className="space-y-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                    {field.label}
                    {field.validationRules?.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  
                  {renderField(field)}
                  
                  {errors[field.name] && errors[field.name].length > 0 && (
                    <div className="flex items-center space-x-2 text-red-600 text-sm">
                      <AlertCircle size={16} />
                      <div>
                        {errors[field.name].map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                <CheckCircle size={20} />
                <span>Submit Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Form Data Preview */}
        {Object.keys(formData).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Current Form Data:</h3>
            <pre className="bg-gray-50 rounded-md p-4 text-sm text-gray-600 overflow-x-auto">
              {JSON.stringify(formData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicFormBuilder;