'use client';

import UserProfile from "@/components/organisms/UserProfile";
import AdminProfile from "@/components/organisms/AdminProfile";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {user?.role === "Admin" ? (
        <AdminProfile />
      ) : (
        <UserProfile />
      )}
    </div>
  );
}