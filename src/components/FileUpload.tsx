"use client";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";

type Props = {};

const FileUpload = (props: Props) => {
  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      console.log(response);
      return response.data;
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <UploadDropzone
        className="m-0"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          try {
            if (!res[0]?.key || !res[0]?.name) {
              toast.error("Something went wong, please try again");
              return;
            }
            mutate(
              { file_key: res[0].key, file_name: res[0].name },
              {
                onSuccess: (data) => {
                  toast.success("Chat created successfully");
                },
                onError: (error) => {
                  toast.error(`${error}`);
                },
              }
            );
          } catch (error) {}
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          toast.error(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default FileUpload;
