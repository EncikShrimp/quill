import { metadata } from "./../../app/layout";
import { Pinecone } from "@pinecone-database/pinecone";
import { downloadFromUploadthing } from "./uploadthing-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

type PDFpage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};

async function loadUploadthingIntoPinecone(file_key: string, file_url: string) {
  console.log("Loading Uploadthing file into Pinecone...");
  const file_name = await downloadFromUploadthing(file_key, file_url);
  if (!file_name) {
    throw new Error("Failed to download file");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFpage[];
  console.log(pages);
}

export { pc, loadUploadthingIntoPinecone };
