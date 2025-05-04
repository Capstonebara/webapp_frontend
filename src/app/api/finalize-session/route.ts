import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

async function deleteFolderRecursive(folderPath: string) {
  try {
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    await Promise.all(
      entries.map((entry) => {
        const fullPath = path.join(folderPath, entry.name);
        return entry.isDirectory()
          ? deleteFolderRecursive(fullPath)
          : fs.unlink(fullPath);
      })
    );
    await fs.rmdir(folderPath);
  } catch (err) {
    console.error("Error deleting folder:", folderPath, err);
  }
}

export async function POST(req: Request) {
  try {
    const { session_id, user_id } = await req.json();

    const root = process.cwd();
    const from = path.join(root, "public", "data", "pics", session_id);
    const to = path.join(root, "public", "data", "pics", String(user_id));

    // Nếu folder đích đã tồn tại, xóa trước
    try {
      await fs.access(to);
      await deleteFolderRecursive(to); // 🔥 Xóa thư mục đích trước khi ghi đè
    } catch (e) {
      console.log(e);
      // Folder chưa tồn tại → bỏ qua
    }

    await fs.rename(from, to); // Di chuyển thư mục

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Finalize session error:", err);
    return NextResponse.json(
      { error: "Failed to finalize session" },
      { status: 500 }
    );
  }
}
