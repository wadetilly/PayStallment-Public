import { useState, useEffect } from 'react';
import FormField from '../ui/FormField';
import { contactSchema, validateField } from '../../lib/validation';

interface ContactFormProps {
  value: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    companyPhone: string;
  };
  onChange: (value: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    companyPhone: string;
  }) => void;
  errors?: Partial<Record<keyof typeof contactSchema._type, string>>;
  onValidation?: (isValid: boolean) => void;
}

export default function ContactForm({ value, onChange, errors: externalErrors, onValidation }: ContactFormProps) {
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  // Validate field on blur
  const handleBlur = (field: keyof typeof value) => {
    setTouched(prev => new Set([...prev, field]));
    const error = validateField(contactSchema, field, value[field]);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  // Check form validity whenever values change
  useEffect(() => {
    const isValid = Object.values(errors).every(error => !error);
    onValidation?.(isValid);
  }, [errors, onValidation]);

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <FormField
          label="First name"
          error={(touched.has('firstName') && errors.firstName) || externalErrors?.firstName}
          required
        >
          <input
            type="text"
            value={value.firstName}
            onChange={e => onChange({ ...value, firstName: e.target.value })}
            onBlur={() => handleBlur('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField
          label="Last name"
          error={(touched.has('lastName') && errors.lastName) || externalErrors?.lastName}
          required
        >
          <input
            type="text"
            value={value.lastName}
            onChange={e => onChange({ ...value, lastName: e.target.value })}
            onBlur={() => handleBlur('lastName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField
          label="Email"
          error={(touched.has('email') && errors.email) || externalErrors?.email}
          required
        >
          <input
            type="email"
            value={value.email}
            onChange={e => onChange({ ...value, email: e.target.value })}
            onBlur={() => handleBlur('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField
          label="Phone number"
          error={(touched.has('phone') && errors.phone) || externalErrors?.phone}
          required
        >
          <input
            type="tel"
            value={value.phone}
            onChange={e => onChange({ ...value, phone: e.target.value })}
            onBlur={() => handleBlur('phone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField
          label="Company name"
          error={(touched.has('companyName') && errors.companyName) || externalErrors?.companyName}
        >
          <input
            type="text"
            value={value.companyName}
            onChange={e => onChange({ ...value, companyName: e.target.value })}
            onBlur={() => handleBlur('companyName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>

        <FormField
          label="Company phone"
          error={(touched.has('companyPhone') && errors.companyPhone) || externalErrors?.companyPhone}
        >
          <input
            type="tel"
            value={value.companyPhone}
            onChange={e => onChange({ ...value, companyPhone: e.target.value })}
            onBlur={() => handleBlur('companyPhone')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </FormField>
      </div>
    </div>
  );
}