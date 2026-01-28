import { Button } from '@/components/ui/button';
import { Download, RotateCcw } from 'lucide-react';

interface DownloadButtonProps {
  onDownload: () => void;
  onReset: () => void;
  disabled?: boolean;
}

const DownloadButton = ({ onDownload, onReset, disabled }: DownloadButtonProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={onReset}
        disabled={disabled}
        size="lg"
        className="flex-1"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button
        onClick={onDownload}
        disabled={disabled}
        size="lg"
        className="flex-1"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>
    </div>
  );
};

export default DownloadButton;
