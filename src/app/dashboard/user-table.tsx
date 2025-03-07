"use client";

import { useState } from "react";
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
import { Eye, Plus } from "lucide-react";
import { UserProfileModal } from "./user-profile-modal";
import { AddUserModal } from "./add-user-modal";

// Mock user data
const users = [
  {
    id: "USR12345",
    username: "johndoe",
    name: "John Doe",
    apartment: "A-1203",
    gender: "Male",
    phone: "+84 123 456 789",
    email: "john.doe@example.com",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR12346",
    username: "janedoe",
    name: "Jane Doe",
    apartment: "B-2104",
    gender: "Female",
    phone: "+84 987 654 321",
    email: "jane.doe@example.com",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR12347",
    username: "robertsmith",
    name: "Robert Smith",
    apartment: "C-3305",
    gender: "Male",
    phone: "+84 555 123 456",
    email: "robert.smith@example.com",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR12348",
    username: "emilyjohnson",
    name: "Emily Johnson",
    apartment: "A-1506",
    gender: "Female",
    phone: "+84 333 789 012",
    email: "emily.johnson@example.com",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "USR12349",
    username: "michaelwilson",
    name: "Michael Wilson",
    apartment: "D-4207",
    gender: "Male",
    phone: "+84 777 345 678",
    email: "michael.wilson@example.com",
    photoUrl: "/placeholder.svg?height=40&width=40",
  },
];

export interface User {
  id: string;
  username: string;
  name: string;
  apartment: string;
  gender: string;
  phone: string;
  email: string;
  photoUrl: string;
}

export function UsersTable() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

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
            {users.map((user) => (
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
