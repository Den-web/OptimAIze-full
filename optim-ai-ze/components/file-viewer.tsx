import { useState } from "react";
import Image from "next/image";
import { Download, X, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FileViewerProps {
  file: {
    url: string;
    filename: string;
    type: string;
    size?: number;
  };
  onClose: () => void;
  isOpen: boolean;
}

export function FileViewer({ file, onClose, isOpen }: FileViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";
  const isVideo = file.type.startsWith("video/");
  const isAudio = file.type.startsWith("audio/");

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const rotate = () => setRotation((prev) => (prev + 90) % 360);

  const downloadFile = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
        <DialogHeader className="p-4 flex items-center justify-between flex-row">
          <DialogTitle className="text-lg flex-1 truncate">{file.filename}</DialogTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </span>
            {isImage && (
              <>
                <Button variant="ghost" size="icon" onClick={zoomOut}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={zoomIn}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={rotate}>
                  <RotateCw className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={downloadFile}>
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-muted/30">
          {isImage && (
            <div 
              className="relative" 
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg)`,
                transition: "transform 0.2s ease-in-out",
              }}
            >
              <Image
                src={file.url}
                alt={file.filename}
                width={800}
                height={600}
                className="max-w-full object-contain"
                style={{ maxHeight: "calc(80vh - 100px)" }}
              />
            </div>
          )}

          {isPdf && (
            <iframe
              src={`${file.url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-0"
              title={file.filename}
            />
          )}

          {isVideo && (
            <video
              src={file.url}
              controls
              className="max-w-full max-h-[calc(80vh-100px)]"
            >
              Your browser does not support the video tag.
            </video>
          )}

          {isAudio && (
            <div className="p-8 flex flex-col items-center justify-center">
              <div className="mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 2a3 3 0 0 0-3 3v9a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <audio src={file.url} controls className="w-64 mt-2" />
            </div>
          )}

          {!isImage && !isPdf && !isVideo && !isAudio && (
            <div className="p-8 text-center">
              <div className="mb-4 w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-lg font-medium">{file.filename}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {formatFileSize(file.size)}
              </p>
              <Button onClick={downloadFile} className="mt-4">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 