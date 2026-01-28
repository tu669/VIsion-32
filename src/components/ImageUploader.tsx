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
    <div className="glass-card rounded-2xl p-6">
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 rounded-xl p-8 border-2 border-dashed border-primary/40"
      >
        <Upload className="w-12 h-12 text-primary" />
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Click to upload an image
          </p>
          <p className="text-xs text-foreground/60 mt-1">
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
        <div className="mt-4 p-4 glass-card rounded-xl">
          <h3 className="text-sm font-bold text-gradient mb-2">
            Image Details
          </h3>
          <div className="space-y-1 text-xs text-foreground/70">
            <p>
              <span className="font-medium text-primary">Name:</span> {imageData.name}
            </p>
            <p>
              <span className="font-medium text-primary">Size:</span>{' '}
              {formatFileSize(imageData.size)}
            </p>
            <p>
              <span className="font-medium text-primary">Dimensions:</span> {imageData.width} x{' '}
              {imageData.height}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
