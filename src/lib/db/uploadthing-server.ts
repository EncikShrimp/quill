import axios from "axios";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { UTApi } from "uploadthing/server";

export const utapi = new UTApi();

export async function downloadFromUploadthing(
  file_key: string,
  file_url: string
): Promise<string> {
  try {
    const downloadFileFromURL = async (
      url: string,
      outputPath: string
    ): Promise<void> => {
      const response = await axios({
        url,
        method: "GET",
        responseType: "stream",
      });

      const fileStream = createWriteStream(outputPath);
      response.data.pipe(fileStream);

      return new Promise((resolve, reject) => {
        fileStream.on("finish", () => {
          console.log("Download completed.");
          resolve();
        });
        fileStream.on("error", (error) => {
          console.error("Error writing the file:", error.message);
          reject(error);
        });
      });
    };

    const rootDir = process.cwd(); // Gets the current working directory

    const tempPdfDir = join(rootDir, "temp_pdf");
    if (!existsSync(tempPdfDir)) {
      mkdirSync(tempPdfDir);
    }

    const fileName = `pdf-${Date.now()}.pdf`;
    const savePath = join(tempPdfDir, fileName); // Adjust the file name as needed
    const fileURL = file_url;

    await downloadFileFromURL(fileURL, savePath);

    return savePath;
  } catch (error) {
    console.error("Failed to download file:", error);
    throw error; // Rethrow the error or handle it as needed
  }
}
