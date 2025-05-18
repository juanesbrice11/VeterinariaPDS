'use client'
import React, { useState, useRef, useEffect } from 'react';

interface FileInputProps {
    label: string;
    onChange: (file: File | null) => void;
    value?: File | null;
    accept?: string;
    maxSize?: number; // in bytes, default 5MB
}

const FileInput: React.FC<FileInputProps> = ({
    label,
    onChange,
    value,
    accept = 'image/*',
    maxSize = 5 * 1024 * 1024
}) => {
    const [fileName, setFileName] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Sync with prop value
    useEffect(() => {
        if (!value) {
            setFileName('');
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [value]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        setError(null);

        if (!files || files.length === 0) {
            setFileName('');
            setPreviewUrl(null);
            onChange(null);
            return;
        }

        const file = files[0];

        // Validate file size
        if (file.size > maxSize) {
            setError(`File is too large. Maximum size is ${maxSize / (1024 * 1024)}MB.`);
            setFileName('');
            setPreviewUrl(null);
            onChange(null);
            return;
        }

        setFileName(file.name);
        onChange(file);

        // Create a preview URL if it's an image
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleRemoveFile = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setFileName('');
        setPreviewUrl(null);
        setError(null);
        onChange(null);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex flex-col">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={handleButtonClick}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Select File
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={accept}
                        className="hidden"
                    />
                    <span className="ml-3 text-gray-600 text-sm">
                        {fileName ? fileName : 'No file selected'}
                    </span>
                    {fileName && (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="ml-2 text-red-600 hover:text-red-800"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
                {previewUrl && (
                    <div className="mt-3">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="h-32 object-cover rounded-md"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileInput; 