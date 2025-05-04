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
    const { user_id } = await req.json();

    const root = process.cwd();
    const picDir = path.join(root, "public", "data", "pics", String(user_id));
    const zipFile = path.join(root, "public", "data", "zips", `${user_id}.zip`);

    // Xóa thư mục ảnh
    try {
      await deleteFolderRecursive(picDir);
    } catch (e) {
      console.log(e);
    }

    // Xóa file ZIP
    try {
      await fs.unlink(zipFile);
    } catch (e) {
      console.log(e);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error cleaning up user data:", err);
    return NextResponse.json({ error: "Failed to clean up" }, { status: 500 });
  }
}
