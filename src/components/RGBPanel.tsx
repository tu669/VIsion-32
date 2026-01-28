import { RGBSettings } from '@/hooks/useImageProcessing';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import Slider from './Slider';
import { useState } from 'react';

interface RGBPanelProps {
  rgbSettings: RGBSettings;
  onSettingsChange: (settings: RGBSettings) => void;
}

const RGBPanel = ({ rgbSettings, onSettingsChange }: RGBPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass-card rounded-2xl p-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full mb-6 hover:text-primary transition-colors">
          <h2 className="text-xl font-bold text-gradient">RGB Color Correction</h2>
          <ChevronDown className={`h-5 w-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="space-y-6">
        <Slider
          label="Red"
          value={rgbSettings.red}
          onChange={(value) =>
            onSettingsChange({ ...rgbSettings, red: value })
          }
          min={-255}
          max={255}
          step={1}
          color="rgb(239, 68, 68)"
        />

        <Slider
          label="Green"
          value={rgbSettings.green}
          onChange={(value) =>
            onSettingsChange({ ...rgbSettings, green: value })
          }
          min={-255}
          max={255}
          step={1}
          color="rgb(34, 197, 94)"
        />

        <Slider
          label="Blue"
          value={rgbSettings.blue}
          onChange={(value) =>
            onSettingsChange({ ...rgbSettings, blue: value })
          }
          min={-255}
          max={255}
          step={1}
          color="rgb(59, 130, 246)"
        />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default RGBPanel;
