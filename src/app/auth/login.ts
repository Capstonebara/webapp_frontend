"use server";

export const loginUser = async (data: {
  username: string;
  password: string;
}) => {
  // Tạo đối tượng FormData để gửi dữ liệu dưới dạng x-www-form-urlencoded
  const formData = new URLSearchParams();
  formData.append("grant_type", "password"); // Giả định grant_type là "password"
  formData.append("username", data.username);
  formData.append("password", data.password);
  // Các trường tùy chọn (nếu cần)
  formData.append("scope", "");
  formData.append("client_id", "");
  formData.append("client_secret", "");

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    console.log("Error response:", result);
    throw new Error(result.message || "Login failed");
  }

  return {
    ...result,
    headers: Object.fromEntries(response.headers.entries()),
  };
};
