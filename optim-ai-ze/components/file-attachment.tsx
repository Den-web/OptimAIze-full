import { useState, useRef } from "react";
import { ImageIcon, FileIcon, XIcon, UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { FileViewer } from "@/components/file-viewer";

interface FileAttachmentProps {
  onFileUpload: (fileData: {
    url: string;
    filename: string;
    type: string;
    size: number;
  }) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  attachedFiles: Array<{
    url: string;
    filename: string;
    type: string;
    size: number;
  }>;
  onRemoveFile: (index: number) => void;
}

export function FileAttachment({
  onFileUpload,
  isUploading,
  setIsUploading,
  attachedFiles,
  onRemoveFile,
}: FileAttachmentProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingFile, setViewingFile] = useState<{
    url: string;
    filename: string;
    type: string;
    size: number;
  } | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      onFileUpload({
        url: data.url,
        filename: data.filename,
        type: data.type,
        size: data.size,
      });
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      // Clear the input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <FileIcon className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept="image/*, application/pdf, video/*, audio/*"
      />

      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        aria-label="Attach file"
      >
        <UploadIcon className="h-4 w-4" />
      </Button>

      {attachedFiles.length > 0 && (
        <div className="mt-2 space-y-2">
          {attachedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md bg-muted/50"
            >
              {getFileIcon(file.type)}
              <div
                className="flex-1 text-sm truncate cursor-pointer hover:underline"
                onClick={() => setViewingFile(file)}
              >
                {file.filename}
                <span className="text-xs text-muted-foreground ml-2">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => onRemoveFile(index)}
                aria-label="Remove file"
              >
                <XIcon className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="mt-2 flex items-center gap-2 p-2 rounded-md bg-muted/50">
          <div className="animate-pulse w-4 h-4 rounded-full bg-primary/70" />
          <span className="text-sm">Uploading file...</span>
        </div>
      )}

      {viewingFile && (
        <FileViewer
          file={viewingFile}
          onClose={() => setViewingFile(null)}
          isOpen={!!viewingFile}
        />
      )}
    </div>
  );
} 