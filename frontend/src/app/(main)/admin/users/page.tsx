'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import { getUsers, updateUser2, deleteUser, GetUsers } from '@/services/UserServices';
import { FaSearch, FaTrash, FaEye, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

function AdminUsersPage() {
    const [users, setUsers] = useState<GetUsers[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<GetUsers[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<GetUsers | null>(null);
    const [editingUser, setEditingUser] = useState<GetUsers | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { isAuthenticated } = useAuth();

    const fetchUsers = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No hay sesión activa');
                return;
            }

            const response = await getUsers(token);
            console.log('Users response:', response);

            if (response.success && response.users) {
                setUsers(response.users);
                setFilteredUsers(response.users);
            } else {
                const errorMessage = response.message || 'Error al cargar los usuarios';
                console.error('Error loading users:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Failed to load users:", err);
            setError('Error al cargar los usuarios. Por favor, intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isAuthenticated]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1); // Resetear a la primera página al buscar
        
        if (!value.trim()) {
            setFilteredUsers(users);
            return;
        }

        const filtered = users.filter(user => 
            user.name.toLowerCase().includes(value.toLowerCase()) ||
            user.email.toLowerCase().includes(value.toLowerCase()) ||
            user.cc.toString().includes(value)
        );
        setFilteredUsers(filtered);
    };

    // Calcular los usuarios para la página actual
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleView = (user: GetUsers) => {
        setSelectedUser(user);
    };

    const handleEdit = (user: GetUsers) => {
        setEditingUser(user);
    };

    const handleDelete = async (userId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await deleteUser(userId, token);
            
            if (response.success) {
                toast.success('Usuario eliminado correctamente');
                await fetchUsers();
            } else {
                toast.error(response.message || 'Error al eliminar el usuario');
            }
        } catch (err) {
            console.error('Error deleting user:', err);
            toast.error('Error al eliminar el usuario');
        }
    };

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const user = users.find(u => u.id === userId);
            if (!user) {
                toast.error('Usuario no encontrado');
                return;
            }

            const userData = {
                id: user.id,
                cc: user.cc,
                name: user.name,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate,
                gender: user.gender,
                address: user.address,
                status: user.status,
                role: newRole
            };

            const response = await updateUser2(userData, token);
            
            if (response.success) {
                toast.success('Rol actualizado correctamente');
                await fetchUsers();
            } else {
                toast.error(response.message || 'Error al actualizar el rol');
            }
        } catch (err) {
            console.error('Error updating role:', err);
            toast.error('Error al actualizar el rol');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Cargando usuarios...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Gestión de Usuarios</h1>
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Gestión de Usuarios</h1>
                
                <div className="flex items-center space-x-4">
                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Buscar por nombre, email o documento..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Nombre</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Documento</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{user.cc}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="text-sm text-gray-900 border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                                        >
                                            <option value="Guest">Invitado</option>
                                            <option value="Client">Cliente</option>
                                            <option value="Veterinario">Veterinario</option>
                                            <option value="Admin">Administrador</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleView(user)}
                                                className="text-emerald-600 hover:text-emerald-700 transition-colors"
                                                title="Ver Detalles"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-amber-600 hover:text-amber-700 transition-colors"
                                                title="Editar Usuario"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-rose-500 hover:text-rose-600 transition-colors"
                                                title="Eliminar Usuario"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                    {searchTerm ? 'No se encontraron usuarios que coincidan con la búsqueda' : 'No hay usuarios registrados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuarios
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`p-2 rounded-md ${
                                currentPage === 1
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronLeft />
                        </button>
                        <span className="text-sm text-gray-700">
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`p-2 rounded-md ${
                                currentPage === totalPages
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {/* User Details Modal */}
            {selectedUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles del Usuario</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Documento</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.cc}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Usuario</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Documento</label>
                                <input
                                    type="text"
                                    value={editingUser.cc}
                                    onChange={(e) => setEditingUser({...editingUser, cc: parseInt(e.target.value)})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Rol</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                >
                                    <option value="Guest">Invitado</option>
                                    <option value="Client">Cliente</option>
                                    <option value="Veterinario">Veterinario</option>
                                    <option value="Admin">Administrador</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleRoleUpdate(editingUser.id, editingUser.role)}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(AdminUsersPage); 