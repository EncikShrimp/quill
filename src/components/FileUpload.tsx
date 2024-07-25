"use client";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

type Props = {};

const FileUpload = (props: Props) => {
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
      file_url,
    }: {
      file_key: string;
      file_name: string;
      file_url: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
        file_url,
      });
      console.log(response);
      return response.data;
    },
  });
  isPending && (
    <>
      <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
      <p className="mt-2 text-sm text-slate-400">Spilling Tea to GPT...</p>
    </>
  );
  return (
    <div className="p-2 bg-white rounded-xl">
      <UploadDropzone
        className="m-0"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          try {
            console.log(res);
            if (!res[0]?.key || !res[0]?.name) {
              toast.error("Something went wong, please try again");
              return;
            }
            mutate(
              {
                file_key: res[0].key,
                file_name: res[0].name,
                file_url: res[0].url,
              },
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
