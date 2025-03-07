"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, Plus, Loader } from "lucide-react";
import { UserProfileModal } from "./user-profile-modal";
import { AddUserModal } from "./add-user-modal";
import { getUsers } from "./fetch";

export interface User {
  id: number;
  username: string;
  name: string;
  apartment: string;
  gender: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export function UsersTable({ token, user }: { token: string; user: string }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const data = await getUsers(user, token);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, [token, user]);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Users</h2>
        <Button onClick={() => setIsAddUserModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {/* Hiển thị spinner khi đang fetch */}
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <Loader className="animate-spin h-10 w-10 text-gray-500" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">Photo</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Apartment</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.photoUrl} alt={user.name} />
                      <AvatarFallback>
                        {user.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.apartment}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewUser(user)}
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <UserProfileModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
      />
    </div>
  );
}
