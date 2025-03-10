import { NextResponse } from "next/server";
import path from "path";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filePath = url.searchParams.get("file");

  if (!filePath) {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  try {
    const projectRoot = process.cwd();
    const absolutePath = path.join(
      projectRoot,
      "data",
      path.basename(filePath)
    );

    // Kiểm tra file có tồn tại không
    await stat(absolutePath);

    // Trả về file ZIP
    const fileStream = createReadStream(absolutePath);
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on("data", (chunk) => controller.enqueue(chunk));
        fileStream.on("end", () => controller.close());
        fileStream.on("error", (err) => controller.error(err));
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${path.basename(
          absolutePath
        )}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", filePath, error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
