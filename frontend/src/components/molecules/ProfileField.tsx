interface ProfileFieldProps {
    label: string;
    value?: string;
    multiline?: boolean;
}

export default function ProfileField({ label, value, multiline = false }: ProfileFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500">{label}</label>
            {multiline ? (
                <p className="mt-1 text-gray-900 whitespace-pre-line">{value || 'Not specified'}</p>
            ) : (
                <p className="mt-1 text-gray-900 truncate">{value || 'Not provided'}</p>
            )}
        </div>
    );
}
