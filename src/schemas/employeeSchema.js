// export const employeeSchema = {
//   title: "Employee Registration Form",
//   fields: [
//     {
//       name: "firstName",
//       type: "text",
//       label: "First Name",
//       validationRules: { required: true, minLength: 2 },
//       placeholder: "Enter your first name"
//     },
//     {
//       name: "lastName",
//       type: "text",
//       label: "Last Name",
//       validationRules: { required: true, minLength: 2 },
//       placeholder: "Enter your last name"
//     },
//     {
//       name: "email",
//       type: "email",
//       label: "Email Address",
//       validationRules: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
//       placeholder: "Enter your email"
//     },
//     {
//       name: "isEmployed",
//       type: "radio",
//       label: "Employment Status",
//       options: [
//         { value: "yes", label: "Currently Employed" },
//         { value: "no", label: "Not Employed" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "companyName",
//       type: "text",
//       label: "Company Name",
//       condition: { field: "isEmployed", value: "yes" },
//       validationRules: { required: true },
//       placeholder: "Enter company name"
//     },
//     {
//       name: "position",
//       type: "select",
//       label: "Position",
//       condition: { field: "isEmployed", value: "yes" },
//       options: [
//         { value: "", label: "Select Position" },
//         { value: "developer", label: "Software Developer" },
//         { value: "designer", label: "UI/UX Designer" },
//         { value: "manager", label: "Project Manager" },
//         { value: "analyst", label: "Business Analyst" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "experience",
//       type: "number",
//       label: "Years of Experience",
//       condition: { field: "isEmployed", value: "yes" },
//       validationRules: { required: true, min: 0, max: 50 },
//       placeholder: "Enter years of experience"
//     },
//     {
//       name: "skills",
//       type: "checkbox",
//       label: "Technical Skills",
//       condition: { field: "isEmployed", value: "yes" },
//       options: [
//         { value: "javascript", label: "JavaScript" },
//         { value: "react", label: "React" },
//         { value: "nodejs", label: "Node.js" },
//         { value: "python", label: "Python" },
//         { value: "java", label: "Java" }
//       ]
//     },
//     {
//       name: "lookingForJob",
//       type: "select",
//       label: "Job Search Status",
//       condition: { field: "isEmployed", value: "no" },
//       options: [
//         { value: "", label: "Select Status" },
//         { value: "actively", label: "Actively Looking" },
//         { value: "casually", label: "Casually Looking" },
//         { value: "not-looking", label: "Not Looking" }
//       ],
//       validationRules: { required: true }
//     }
//   ]
// };

import { z } from 'zod';

// 1. Define the Zod schema for validation
export const employeeZodSchema = z.object({
  firstName: z.string().min(2, 'First Name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  isEmployed: z.enum(['yes', 'no'], 'Employment Status is required'),

  // Conditionally required fields
  companyName: z.string().optional(),
  position: z.string().optional(),
  experience: z.coerce.number().optional().refine(val => val >= 0 && val <= 50, {
    message: 'Experience must be between 0 and 50'
  }),
  skills: z.array(z.string()).optional(),

  lookingForJob: z.string().optional()
}).superRefine((data, ctx) => {
  // Conditional logic
  if (data.isEmployed === 'yes') {
    if (!data.companyName || data.companyName.trim() === '') {
      ctx.addIssue({
        path: ['companyName'],
        message: 'Company Name is required'
      });
    }
    if (!data.position || data.position === '') {
      ctx.addIssue({
        path: ['position'],
        message: 'Position is required'
      });
    }
    if (data.experience === undefined || isNaN(data.experience)) {
      ctx.addIssue({
        path: ['experience'],
        message: 'Experience is required'
      });
    }
  }

  if (data.isEmployed === 'no') {
    if (!data.lookingForJob || data.lookingForJob === '') {
      ctx.addIssue({
        path: ['lookingForJob'],
        message: 'Job Search Status is required'
      });
    }
  }
});

// 2. Export original schema for UI rendering
export const employeeSchema = {
  title: "Employee Registration Form",
  zodSchema: employeeZodSchema, // attach for validation use
  fields: [
    {
      name: "firstName",
      type: "text",
      label: "First Name",
      validationRules: { required: true, minLength: 2 },
      placeholder: "Enter your first name"
    },
    {
      name: "lastName",
      type: "text",
      label: "Last Name",
      validationRules: { required: true, minLength: 2 },
      placeholder: "Enter your last name"
    },
    {
      name: "email",
      type: "email",
      label: "Email Address",
      validationRules: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      placeholder: "Enter your email"
    },
    {
      name: "isEmployed",
      type: "radio",
      label: "Employment Status",
      options: [
        { value: "yes", label: "Currently Employed" },
        { value: "no", label: "Not Employed" }
      ],
      validationRules: { required: true }
    },
    {
      name: "companyName",
      type: "text",
      label: "Company Name",
      condition: { field: "isEmployed", value: "yes" },
      validationRules: { required: true },
      placeholder: "Enter company name"
    },
    {
      name: "position",
      type: "select",
      label: "Position",
      condition: { field: "isEmployed", value: "yes" },
      options: [
        { value: "", label: "Select Position" },
        { value: "developer", label: "Software Developer" },
        { value: "designer", label: "UI/UX Designer" },
        { value: "manager", label: "Project Manager" },
        { value: "analyst", label: "Business Analyst" }
      ],
      validationRules: { required: true }
    },
    {
      name: "experience",
      type: "number",
      label: "Years of Experience",
      condition: { field: "isEmployed", value: "yes" },
      validationRules: { required: true, min: 0, max: 50 },
      placeholder: "Enter years of experience"
    },
    {
      name: "skills",
      type: "checkbox",
      label: "Technical Skills",
      condition: { field: "isEmployed", value: "yes" },
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "react", label: "React" },
        { value: "nodejs", label: "Node.js" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" }
      ]
    },
    {
      name: "lookingForJob",
      type: "select",
      label: "Job Search Status",
      condition: { field: "isEmployed", value: "no" },
      options: [
        { value: "", label: "Select Status" },
        { value: "actively", label: "Actively Looking" },
        { value: "casually", label: "Casually Looking" },
        { value: "not-looking", label: "Not Looking" }
      ],
      validationRules: { required: true }
    }
  ]
};
