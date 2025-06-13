// export const surveySchema = {
//   title: "Customer Feedback Survey",
//   fields: [
//     {
//       name: "customerType",
//       type: "radio",
//       label: "Customer Type",
//       options: [
//         { value: "new", label: "New Customer" },
//         { value: "existing", label: "Existing Customer" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "purchaseFrequency",
//       type: "select",
//       label: "How often do you purchase from us?",
//       condition: { field: "customerType", value: "existing" },
//       options: [
//         { value: "", label: "Select Frequency" },
//         { value: "weekly", label: "Weekly" },
//         { value: "monthly", label: "Monthly" },
//         { value: "quarterly", label: "Quarterly" },
//         { value: "yearly", label: "Yearly" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "referralSource",
//       type: "select",
//       label: "How did you hear about us?",
//       condition: { field: "customerType", value: "new" },
//       options: [
//         { value: "", label: "Select Source" },
//         { value: "social-media", label: "Social Media" },
//         { value: "friend", label: "Friend/Family" },
//         { value: "advertisement", label: "Advertisement" },
//         { value: "search-engine", label: "Search Engine" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "satisfaction",
//       type: "radio",
//       label: "Overall Satisfaction",
//       options: [
//         { value: "very-satisfied", label: "Very Satisfied" },
//         { value: "satisfied", label: "Satisfied" },
//         { value: "neutral", label: "Neutral" },
//         { value: "dissatisfied", label: "Dissatisfied" }
//       ],
//       validationRules: { required: true }
//     },
//     {
//       name: "improvements",
//       type: "checkbox",
//       label: "What areas need improvement?",
//       condition: { field: "satisfaction", value: ["neutral", "dissatisfied"] },
//       options: [
//         { value: "customer-service", label: "Customer Service" },
//         { value: "product-quality", label: "Product Quality" },
//         { value: "pricing", label: "Pricing" },
//         { value: "delivery", label: "Delivery Speed" },
//         { value: "website", label: "Website Experience" }
//       ]
//     }
//   ]
// };

import { z } from 'zod';

// 1. Zod validation schema
export const surveyZodSchema = z.object({
  customerType: z.enum(['new', 'existing'], { message: 'Customer Type is required' }),

  purchaseFrequency: z.string().optional(),
  referralSource: z.string().optional(),

  satisfaction: z.enum(
    ['very-satisfied', 'satisfied', 'neutral', 'dissatisfied'],
    { message: 'Satisfaction rating is required' }
  ),

  improvements: z.array(z.string()).optional()
}).superRefine((data, ctx) => {
  if (data.customerType === 'existing') {
    if (!data.purchaseFrequency || data.purchaseFrequency === '') {
      ctx.addIssue({
        path: ['purchaseFrequency'],
        message: 'Purchase Frequency is required for existing customers'
      });
    }
  }

  if (data.customerType === 'new') {
    if (!data.referralSource || data.referralSource === '') {
      ctx.addIssue({
        path: ['referralSource'],
        message: 'Referral Source is required for new customers'
      });
    }
  }

  if (['neutral', 'dissatisfied'].includes(data.satisfaction)) {
    if (!data.improvements || data.improvements.length === 0) {
      ctx.addIssue({
        path: ['improvements'],
        message: 'Please select at least one area for improvement'
      });
    }
  }
});

// 2. Schema for form rendering
export const surveySchema = {
  title: "Customer Feedback Survey",
  zodSchema: surveyZodSchema,
  fields: [
    {
      name: "customerType",
      type: "radio",
      label: "Customer Type",
      options: [
        { value: "new", label: "New Customer" },
        { value: "existing", label: "Existing Customer" }
      ],
      validationRules: { required: true }
    },
    {
      name: "purchaseFrequency",
      type: "select",
      label: "How often do you purchase from us?",
      condition: { field: "customerType", value: "existing" },
      options: [
        { value: "", label: "Select Frequency" },
        { value: "weekly", label: "Weekly" },
        { value: "monthly", label: "Monthly" },
        { value: "quarterly", label: "Quarterly" },
        { value: "yearly", label: "Yearly" }
      ],
      validationRules: { required: true }
    },
    {
      name: "referralSource",
      type: "select",
      label: "How did you hear about us?",
      condition: { field: "customerType", value: "new" },
      options: [
        { value: "", label: "Select Source" },
        { value: "social-media", label: "Social Media" },
        { value: "friend", label: "Friend/Family" },
        { value: "advertisement", label: "Advertisement" },
        { value: "search-engine", label: "Search Engine" }
      ],
      validationRules: { required: true }
    },
    {
      name: "satisfaction",
      type: "radio",
      label: "Overall Satisfaction",
      options: [
        { value: "very-satisfied", label: "Very Satisfied" },
        { value: "satisfied", label: "Satisfied" },
        { value: "neutral", label: "Neutral" },
        { value: "dissatisfied", label: "Dissatisfied" }
      ],
      validationRules: { required: true }
    },
    {
      name: "improvements",
      type: "checkbox",
      label: "What areas need improvement?",
      condition: { field: "satisfaction", value: ["neutral", "dissatisfied"] },
      options: [
        { value: "customer-service", label: "Customer Service" },
        { value: "product-quality", label: "Product Quality" },
        { value: "pricing", label: "Pricing" },
        { value: "delivery", label: "Delivery Speed" },
        { value: "website", label: "Website Experience" }
      ]
    }
  ]
};
