"use client";

import { useRef, useState } from "react";

export interface UploadedFile {
  name: string;
  url: string;
}

export function PhotoUploader({
  orderId,
  maxFiles,
  onUploaded
}: {
  orderId: string;
  maxFiles: number;
  onUploaded: (files: UploadedFile[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(fileList: FileList) {
    if (files.length + fileList.length > maxFiles) {
      setError(`This package allows up to ${maxFiles} photos.`);
      return;
    }
    setError(null);
    setUploading(true);

    const uploaded: UploadedFile[] = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("orderId", orderId);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        uploaded.push({ name: file.name, url: data.url });
      }
    }

    const next = [...files, ...uploaded];
    setFiles(next);
    onUploaded(next);
    setUploading(false);
  }

  return (
    <div>
      <div
        className="cursor-pointer rounded-lg border-2 border-dashed border-gray p-8 text-center hover:border-blue"
        onClick={() => inputRef.current?.click()}
      >
        <p className="font-display font-bold text-navy">
          Click to upload photos ({files.length}/{maxFiles})
        </p>
        <p className="mt-1 text-sm text-ink/60">JPG or PNG, up to {maxFiles} photos</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploading && <p className="mt-2 text-sm text-blue">Uploading...</p>}
      {error && <p className="mt-2 text-sm text-red">{error}</p>}

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {files.map((file) => (
            <div key={file.url} className="aspect-square overflow-hidden rounded-md bg-gray">
              <img src={file.url} alt={file.name} className="h-full w-full object-cover" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
