import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { UploadedImageData } from '@/hooks/useImageProcessing';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  imageData: UploadedImageData | null;
}

const ImageUploader = ({ onImageUpload, imageData }: ImageUploaderProps) => {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && file.type.startsWith('image/')) {
        onImageUpload(file);
      }
    },
    [onImageUpload]
  );

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors rounded-lg p-8 border-2 border-dashed border-border"
      >
        <Upload className="w-12 h-12 text-muted-foreground" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Click to upload an image
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            PNG, JPG, WEBP up to 10MB
          </p>
        </div>
        <input
          id="image-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {imageData && (
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
          <h3 className="text-sm font-medium text-foreground mb-2">
            Image Details
          </h3>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium">Name:</span> {imageData.name}
            </p>
            <p>
              <span className="font-medium">Size:</span>{' '}
              {formatFileSize(imageData.size)}
            </p>
            <p>
              <span className="font-medium">Dimensions:</span> {imageData.width} x{' '}
              {imageData.height}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
