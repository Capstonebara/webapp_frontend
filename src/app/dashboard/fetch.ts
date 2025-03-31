"use server";

import { DashboardSchema } from "./type";

export async function getUsers(username: string, token: string) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/residents/users_info?username=${username}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function deleteUser(userId: number, token: string) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/residents/delete?user_id=${userId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}

export async function addUser(form: DashboardSchema, token: string) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const formData = {
    username: form.username,
    name: form.fullname,
    apartment_number: form.apartment,
    gender: form.gender,
    phone: form.phone || "",
    email: form.email || "",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/residents/create`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    console.log("Error response:", result);
    throw new Error(result.message || "Add user failed");
  }

  return result;
}

export async function editUser(
  form: DashboardSchema,
  token: string,
  id: number
) {
  if (!token) {
    throw new Error("Unauthorized");
  }

  const formData = {
    username: form.username,
    name: form.fullname,
    apartment_number: form.apartment,
    gender: form.gender,
    phone: form.phone || "",
    email: form.email || "",
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/residents/update?user_id=${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }
  );

  const result = await response.json();
  if (!response.ok) {
    console.log("Error response:", result);
    throw new Error(result.message || "Edit user failed");
  }

  return result;
}

export async function getLogsByDay(username: string, token: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/residents/logs_by_day?username=${username}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch logs");
  }

  return res.json();
}
