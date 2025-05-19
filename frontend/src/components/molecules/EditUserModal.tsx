import React, { useState, useEffect } from "react";
import { GetUsers } from "@/types/schemas";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: GetUsers | null;
  onSave: (updatedUser: GetUsers) => void;
};

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = useState<GetUsers | null>(user);

  useEffect(() => {
    setForm(user);
  }, [user]);

  if (!isOpen || !form) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'birthDate') {
      const date = new Date(value);
      const formattedDate = date.toISOString().split('T')[0];
      setForm({ ...form, [name]: formattedDate });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Editar Usuario</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Nombre</label>
              <input name="name" value={form.name || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">CC</label>
              <input name="cc" value={form.cc || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" value={form.email || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Teléfono</label>
              <input name="phone" value={form.phone || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Fecha de nacimiento</label>
              <input 
                name="birthDate" 
                type="date" 
                value={form.birthDate ? new Date(form.birthDate).toISOString().split('T')[0] : ''} 
                onChange={handleChange} 
                className="w-full border rounded px-2 py-1" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Género</label>
              <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full border rounded px-2 py-1">
                <option value="">Selecciona</option>
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Dirección</label>
              <input name="address" value={form.address || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Estado</label>
              <input name="status" value={form.status || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
            <div>
              <label className="block text-sm font-medium">Rol</label>
              <input name="role" value={form.role || ''} onChange={handleChange} className="w-full border rounded px-2 py-1" />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;