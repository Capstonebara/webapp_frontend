import { createWriteStream } from "fs";
import { stat } from "fs/promises";
import path from "path";
import archiver from "archiver";
import { NextResponse } from "next/server";
import fs from "fs/promises";

export async function POST(req: Request) {
  try {
    const { user_id } = await req.json();
    const projectRoot = process.cwd();
    const publicDir = path.join(projectRoot, "public");
    const dataDir = path.join(publicDir, "data");
    const picsDir = path.join(dataDir, "pics", String(user_id)); // ✅ chỉ zip đúng folder
    const zipPath = path.join(dataDir, "zips", `${user_id}.zip`);

    // Kiểm tra folder có tồn tại không
    const stats = await stat(picsDir);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: "No images to zip" }, { status: 404 });
    }

    // Tạo folder zips nếu chưa có
    const zipsDir = path.join(dataDir, "zips");
    await fs.mkdir(zipsDir, { recursive: true });

    const output = createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.pipe(output);
    archive.directory(picsDir, false);
    await archive.finalize();

    await new Promise((resolve, reject) => {
      output.on("close", () => resolve(undefined));
      output.on("error", reject);
    });

    return NextResponse.json({
      success: true,
      zipFiles: [`data/zips/${user_id}.zip`],
    });
  } catch (error) {
    console.error("Error zipping images:", error);
    return NextResponse.json(
      { error: "Failed to zip images" },
      { status: 500 }
    );
  }
}
