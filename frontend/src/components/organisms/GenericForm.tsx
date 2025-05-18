'use client'
import React, { useState, useCallback } from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Button from '@/components/atoms/Button';

export interface FormFieldOption {
    value: string;
    label: string;
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select';
    placeholder?: string;
    required?: boolean;
    validation?: (value: string) => string | null;
    options?: FormFieldOption[];
}

interface GenericFormProps {
    fields: FormField[];
    onSubmit: (formData: Record<string, any>) => void;
    submitButtonText?: string;
    initialValues?: Record<string, any>;
}

const GenericForm: React.FC<GenericFormProps> = ({
    fields,
    onSubmit,
    submitButtonText = 'Submit',
    initialValues = {}
}) => {
    const [formData, setFormData] = useState<Record<string, any>>(() => {
        const initialData: Record<string, any> = {};
        fields.forEach(field => {
            initialData[field.name] = initialValues[field.name] || '';
        });
        return initialData;
    });
    const [errors, setErrors] = useState<Record<string, string | null>>({});

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }, [errors]);

    const validate = useCallback(() => {
        const newErrors: Record<string, string | null> = {};
        let isValid = true;
        fields.forEach(field => {
            if (field.required && !formData[field.name]) {
                newErrors[field.name] = `${field.label} is required.`;
                isValid = false;
            } else if (field.type === 'select' && field.required && formData[field.name] === '') {
                newErrors[field.name] = `Please select a ${field.label.toLowerCase()}.`;
                isValid = false;
            }
            if (field.validation && formData[field.name]) {
                const error = field.validation(formData[field.name]);
                if (error) {
                    newErrors[field.name] = error;
                    isValid = false;
                }
            }
        });
        setErrors(newErrors);
        return isValid;
    }, [fields, formData]);

    const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    }, [formData, onSubmit, validate]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(field => {
                if (field.type === 'select') {
                    return (
                        <Select
                            key={field.name}
                            label={field.label}
                            name={field.name}
                            options={field.options || []}
                            value={formData[field.name]}
                            onChange={handleChange}
                            error={errors[field.name] || undefined}
                            required={field.required}
                        />
                    );
                }
                return (
                    <Input
                        key={field.name}
                        label={field.label}
                        name={field.name}
                        type={field.type as 'text' | 'email' | 'password' | 'number' | 'date'}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        onChange={handleChange}
                        error={errors[field.name] || undefined}
                        required={field.required}
                    />
                );
            })}
            <Button type="submit" variant="primary" fullWidth={true}>
                {submitButtonText}
            </Button>
        </form>
    );
};

export default GenericForm; 