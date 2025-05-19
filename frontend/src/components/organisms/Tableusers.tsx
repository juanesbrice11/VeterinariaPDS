"use client";

import React, { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/services/UserServices";
import { toast } from 'react-hot-toast';
import { GetUsers } from "@/types/schemas";
import Navbar from '@/components/organisms/Navbar';

const UsersPage = () => {
  const [users, setUsers] = useState<GetUsers[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error('Authentication token not found');
      return;
    }
    const res = await getUsers(token, page);
    console.log("getUsers response →", res);
    setUsers(res.users);
    setTotal(res.total);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario?")) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      await deleteUser(id, token);
      fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-semibold mb-6">Manage Employees</h1>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">CC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Role</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u, i) => (
                <tr key={u.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.cc}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{u.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{u.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                    <button className="px-4 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="px-4 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-600">
            Showing records {((page - 1) * 8) + 1} to {Math.min(page * 8, total)} of {total}
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-3 py-1 rounded-lg bg-gray-300 disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Previous
            </button>
            <span className="text-sm font-medium">{page}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 8 >= total}
              className="px-3 py-1 rounded-lg bg-gray-300 disabled:opacity-50 hover:bg-gray-400 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
