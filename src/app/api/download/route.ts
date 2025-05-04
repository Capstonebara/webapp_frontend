import { NextResponse } from "next/server";
import path from "path";
import { createReadStream } from "fs";
import { stat } from "fs/promises";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const fileParam = url.searchParams.get("file");

  if (!fileParam) {
    return NextResponse.json({ error: "Missing file path" }, { status: 400 });
  }

  try {
    const projectRoot = process.cwd();
    const zipDir = path.join(projectRoot, "public", "data", "zips");
    const filename = path.basename(fileParam); // "2.zip"
    const absolutePath = path.join(zipDir, filename);

    await stat(absolutePath); // check existence

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
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", fileParam, error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
