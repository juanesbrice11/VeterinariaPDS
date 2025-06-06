'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { withAuth } from '@/components/hoc/withAuth';
import { getServices, createService, updateService, deleteService, Service } from '@/services/ServiceServices';
import { FaSearch, FaTrash, FaEye, FaEdit, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [filteredServices, setFilteredServices] = useState<Service[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [newService, setNewService] = useState<Omit<Service, 'id'>>({
        title: '',
        description: '',
        isActive: true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const { isAuthenticated } = useAuth();

    const fetchServices = async () => {
        if (!isAuthenticated) return;

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No active session');
                return;
            }

            const response = await getServices(token);
            console.log('Services response:', response);

            if (response.success && response.services) {
                setServices(response.services);
                setFilteredServices(response.services);
            } else {
                const errorMessage = response.message || 'Error loading services';
                console.error('Error loading services:', errorMessage);
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Failed to load services:", err);
            setError('Error loading services. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [isAuthenticated]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setCurrentPage(1);
        
        if (!value.trim()) {
            setFilteredServices(services);
            return;
        }

        const filtered = services.filter(service => 
            service.title.toLowerCase().includes(value.toLowerCase()) ||
            service.description.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredServices(filtered);
    };

    const indexOfLastService = currentPage * itemsPerPage;
    const indexOfFirstService = indexOfLastService - itemsPerPage;
    const currentServices = filteredServices.slice(indexOfFirstService, indexOfLastService);
    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleView = (service: Service) => {
        setSelectedService(service);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
    };

    const handleCreate = () => {
        setNewService({
            title: '',
            description: '',
            isActive: true
        });
        setIsCreating(true);
    };

    const handleDelete = async (serviceId: number) => {
        if (!window.confirm('Are you sure you want to delete this service?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await deleteService(serviceId, token);
            
            if (response.success) {
                toast.success('Service deleted successfully');
                await fetchServices();
            } else {
                toast.error(response.message || 'Error deleting service');
            }
        } catch (err) {
            console.error('Error deleting service:', err);
            toast.error('Error deleting service');
        }
    };

    const handleUpdateService = async () => {
        if (!editingService) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await updateService(editingService.id, editingService, token);
            
            if (response.success) {
                toast.success('Service updated successfully');
                await fetchServices();
                setEditingService(null);
            } else {
                toast.error(response.message || 'Error updating service');
            }
        } catch (err) {
            console.error('Error updating service:', err);
            toast.error('Error updating service');
        }
    };

    const handleCreateService = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await createService(newService, token);
            
            if (response.success) {
                toast.success('Service created successfully');
                await fetchServices();
                setIsCreating(false);
            } else {
                toast.error(response.message || 'Error creating service');
            }
        } catch (err) {
            console.error('Error creating service:', err);
            toast.error('Error creating service');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Service Management</h1>
                <div className="flex items-center justify-center p-12">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading services...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white p-6">
                <h1 className="text-3xl font-bold mb-6">Service Management</h1>
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-700">Service Management</h1>
                
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
                            placeholder="Search by name or description..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>

                    {/* Add New Service Button */}
                    <button
                        onClick={handleCreate}
                        className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>New Service</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentServices.length > 0 ? (
                            currentServices.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">{service.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            service.isActive 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleView(service)}
                                                className="text-emerald-600 hover:text-emerald-700 transition-colors"
                                                title="View Details"
                                            >
                                                <FaEye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="text-amber-600 hover:text-amber-700 transition-colors"
                                                title="Edit Service"
                                            >
                                                <FaEdit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="text-rose-500 hover:text-rose-600 transition-colors"
                                                title="Delete Service"
                                            >
                                                <FaTrash size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                                    {searchTerm ? 'No services found matching your search' : 'No services registered'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {filteredServices.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Showing {indexOfFirstService + 1} to {Math.min(indexOfLastService, filteredServices.length)} of {filteredServices.length} services
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

            {/* Service Details Modal */}
            {selectedService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Details</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedService.title}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedService.description}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <p className="mt-1 text-sm text-gray-900">{selectedService.isActive ? 'Active' : 'Inactive'}</p>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Service Modal */}
            {editingService && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Service</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingService.title}
                                    onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={editingService.description}
                                    onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    value={editingService.isActive ? 'true' : 'false'}
                                    onChange={(e) => setEditingService({...editingService, isActive: e.target.value === 'true'})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setEditingService(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateService}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Service Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">New Service</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={newService.title}
                                    onChange={(e) => setNewService({...newService, title: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                    placeholder="Enter service name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    value={newService.description}
                                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 text-gray-900"
                                    placeholder="Enter service description"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateService}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default withAuth(ServicesPage); 