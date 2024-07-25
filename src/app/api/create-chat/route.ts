import { db } from "@/lib/db";
import { loadUploadthingIntoPinecone } from "@/lib/db/pinecone";
import { chats } from "@/lib/db/schema";
// import { loadS3IntoPinecone } from "@/lib/pinecone";
// import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// /api/create-chat
export async function POST(req: Request, res: Response) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { file_key, file_name, file_url } = body;

    const pages = loadUploadthingIntoPinecone(file_key, file_url);

    // await loadS3IntoPinecone(file_key);
    // const chat_id = await db
    //   .insert(chats)
    //   .values({
    //     fileKey: file_key,
    //     pdfName: file_name,
    //     pdfUrl: getS3Url(file_key),
    //     userId,
    //   })
    //   .returning({
    //     insertedId: chats.id,
    //   });

    return NextResponse.json(
      {
        chat_id: pages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 }
    );
  }
}
