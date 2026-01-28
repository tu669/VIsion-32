import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';

interface ApplyButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const ApplyButton = ({ onClick, disabled }: ApplyButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="w-full"
    >
      <Wand2 className="w-4 h-4 mr-2" />
      Apply Processing
    </Button>
  );
};

export default ApplyButton;
