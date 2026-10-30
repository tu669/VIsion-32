import { RGBSettings } from '@/hooks/useImageProcessing';
import Slider from './Slider';

interface RGBPanelProps {
  rgbSettings: RGBSettings;
  onSettingsChange: (settings: RGBSettings) => void;
}

const RGBPanel = ({ rgbSettings, onSettingsChange }: RGBPanelProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        RGB Color Correction
      </h2>

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
    </div>
  );
};

export default RGBPanel;
