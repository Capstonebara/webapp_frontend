import { createWriteStream } from "fs";
import { readdir, stat, unlink, rmdir } from "fs/promises";
import path from "path";
import archiver from "archiver";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const projectRoot = process.cwd();
    const publicDir = path.join(projectRoot, "public");
    const dataDir = path.join(publicDir, "data");
    const picsDir = path.join(dataDir, "pics");

    const zipFiles: string[] = [];

    // Get all directories inside picsDir
    const directories = await readdir(picsDir);
    for (const dir of directories) {
      const dirPath = path.join(picsDir, dir);
      const stats = await stat(dirPath);
      if (stats.isDirectory()) {
        const zipPath = path.join(dataDir, `pics.zip`);
        zipFiles.push(zipPath);

        // Create a write stream for the zip file
        const output = createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(output);
        archive.directory(dirPath, false);

        await archive.finalize();

        // Wait for the zip to complete
        await new Promise((resolve, reject) => {
          output.on("close", () => resolve(undefined));
          output.on("error", reject);
        });

        // Delete the folder after zipping
        await deleteFolderRecursive(dirPath);
      }
    }

    return NextResponse.json({ success: true, zipFiles });
  } catch (error) {
    console.error("Error zipping images:", error);
    return NextResponse.json(
      { error: "Failed to zip images" },
      { status: 500 }
    );
  }
}

async function deleteFolderRecursive(folderPath: string) {
  try {
    const files = await readdir(folderPath);
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const stats = await stat(filePath);
      if (stats.isDirectory()) {
        await deleteFolderRecursive(filePath);
      } else {
        await unlink(filePath);
      }
    }
    await rmdir(folderPath);
  } catch (error) {
    console.error("Error deleting folder:", folderPath, error);
  }
}
