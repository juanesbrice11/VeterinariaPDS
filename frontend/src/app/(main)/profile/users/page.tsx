'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import { getUsers, deleteUser, updateUser2 } from '@/services/UserServices';
import { FaSearch, FaTrash, FaEye, FaEdit, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [editingUser, setEditingUser] = useState<any>(null);
    const { isAuthenticated, user } = useAuth();
    const itemsPerPage = 5;

    const fetchUsers = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await getUsers(token, currentPage);
            console.log('Users response:', response);

            if (response.users) {
                setUsers(response.users);
                setFilteredUsers(response.users);
                setTotalUsers(response.total);
            } else {
                setError(response.message || 'Error loading users');
            }
        } catch (err) {
            console.error("Failed to load users:", err);
            setError('Error loading users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [isAuthenticated, currentPage]);

    const handleDelete = async (userId: number) => {
        // Check if the user is trying to delete themselves
        if (userId === user?.id) {
            toast.error('You cannot delete your own account');
            return;
        }

        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await deleteUser(userId, token);
            
            if (response.success) {
                toast.success('User deleted successfully');
                await fetchUsers();
            } else {
                toast.error(response.message || 'Error deleting user');
            }
        } catch (err: any) {
            console.error('Error deleting user:', err);
            // Handle the specific error message from the backend
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error('Error deleting user');
            }
        }
    };

    const handleRoleUpdate = async (userId: number, newRole: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const user = users.find(u => u.id === userId);
            if (!user) {
                toast.error('User not found');
      return;
    }

            const userData = {
                id: userId,
                cc: user.documentNumber,
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                birthDate: user.birthDate || '',
                gender: user.gender || '',
                address: user.address || '',
                status: user.status || 'Active',
                role: newRole
            };

            const response = await updateUser2(userData, token);
            
            if (response.success) {
                toast.success('User updated successfully');
                await fetchUsers();
            } else {
                toast.error(response.message || 'Error updating user');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            toast.error('Error updating user');
        }
    };

    const handleUpdateUser = async (userData: any) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await updateUser2(userData, token);
            
            if (response.success) {
                toast.success('User updated successfully');
                await fetchUsers();
            } else {
                toast.error(response.message || 'Error updating user');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            toast.error('Error updating user');
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        
        filterUsers(value, selectedRole);
    };

    const handleRoleFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const role = e.target.value;
        setSelectedRole(role);
        setCurrentPage(1);
        
        filterUsers(searchTerm, role);
    };

    const filterUsers = (search: string, role: string) => {
        let filtered = users;

        // Filter by search term
        if (search.trim()) {
            filtered = filtered.filter(user => 
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase()) ||
                user.documentNumber.includes(search)
            );
        }

        // Filter by role
        if (role !== 'all') {
            filtered = filtered.filter(user => user.role === role);
        }

        setFilteredUsers(filtered);
    };

    const handleView = (user: any) => {
        setSelectedUser(user);
    };

    const handleEdit = (user: any) => {
        setEditingUser(user);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">User Management</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading users...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">User Management</h1>
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

  return (
        <div className="min-h-screen bg-white p-6">
      <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">User Management</h1>
                
                <div className="flex items-center space-x-4">
                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={handleRoleFilter}
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-gray-900"
                    >
                        <option value="all">All Roles</option>
                        <option value="Guest">Guest</option>
                        <option value="Client">Client</option>
                        <option value="Veterinario">Veterinarian</option>
                        <option value="Admin">Administrator</option>
                    </select>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Search by name, email or document..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                </div>
      </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Document</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
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
                                        <div className="text-sm text-gray-900">{user.documentNumber}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                                            className="text-sm text-gray-900 border rounded px-2 py-1"
                                        >
                                            <option value="Guest">Guest</option>
                                            <option value="Client">Client</option>
                                            <option value="Veterinario">Veterinarian</option>
                                            <option value="Admin">Administrator</option>
                                        </select>
                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user.status === 'Active' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleView(user)}
                                                className="text-emerald-600 hover:text-emerald-700 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="text-amber-600 hover:text-amber-700 transition-colors"
                                                title="Edit User"
                                            >
                                                <FaEdit size={18} />
                        </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="text-rose-500 hover:text-rose-600 transition-colors"
                                                title="Delete User"
                                            >
                                                <FaTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                    {searchTerm ? 'No users found matching your search' : 'No users registered'}
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
                        Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUsers.length)} of {filteredUsers.length} users
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
                            Page {currentPage} of {totalPages}
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Document</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.documentNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.role}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedUser.status}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
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
                                <label className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    value={editingUser.role}
                                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                >
                                    <option value="Guest">Guest</option>
                                    <option value="Client">Client</option>
                                    <option value="Veterinario">Veterinarian</option>
                                    <option value="Admin">Administrator</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingUser(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    handleUpdateUser(editingUser);
                                    setEditingUser(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
        </div>
      )}
    </div>
  );
} 

export default withAuth(UsersPage); 