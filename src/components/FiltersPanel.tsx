import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { FilterType, FilterSettings } from '@/hooks/useImageProcessing';
import Slider from './Slider';
import { useState } from 'react';

interface FiltersPanelProps {
  activeFilter: FilterType | null;
  onFilterSelect: (filter: FilterType) => void;
  filterSettings: FilterSettings;
  onSettingsChange: (settings: FilterSettings) => void;
}

const filters: { id: FilterType; label: string; hasControls: boolean }[] = [
  { id: 'grayscale', label: 'Grayscale', hasControls: false },
  { id: 'blackwhite', label: 'Black & White', hasControls: true },
  { id: 'brightness', label: 'Brightness', hasControls: true },
  { id: 'contrast', label: 'Contrast', hasControls: true },
  { id: 'saturation', label: 'Saturation', hasControls: true },
  { id: 'sharpen', label: 'Sharpen', hasControls: true },
  { id: 'blur', label: 'Blur', hasControls: true },
  { id: 'edge', label: 'Edge Detection', hasControls: false },
  { id: 'invert', label: 'Invert', hasControls: false },
  { id: 'enhance', label: 'Enhance', hasControls: false },
  { id: 'segment', label: 'Segment', hasControls: true },
];

const FiltersPanel = ({
  activeFilter,
  onFilterSelect,
  filterSettings,
  onSettingsChange,
}: FiltersPanelProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="glass-card rounded-2xl p-6">
        <CollapsibleTrigger className="flex items-center justify-between w-full mb-4 hover:text-primary transition-colors">
          <h2 className="text-xl font-bold text-gradient">Filters</h2>
          <ChevronDown className={`h-5 w-5 text-primary transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </CollapsibleTrigger>
        
        <CollapsibleContent>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFilterSelect(filter.id)}
            className="transition-all"
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {activeFilter && (
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-sm font-medium text-foreground">
            {filters.find((f) => f.id === activeFilter)?.label} Controls
          </h3>

          {activeFilter === 'brightness' && (
            <Slider
              label="Brightness"
              value={filterSettings.brightness}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, brightness: value })
              }
              min={-100}
              max={100}
              step={1}
            />
          )}

          {activeFilter === 'contrast' && (
            <Slider
              label="Contrast"
              value={filterSettings.contrast}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, contrast: value })
              }
              min={-100}
              max={100}
              step={1}
            />
          )}

          {activeFilter === 'saturation' && (
            <Slider
              label="Saturation"
              value={filterSettings.saturation}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, saturation: value })
              }
              min={-100}
              max={100}
              step={1}
            />
          )}

          {(activeFilter === 'blackwhite' || activeFilter === 'segment') && (
            <Slider
              label="Threshold"
              value={filterSettings.threshold}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, threshold: value })
              }
              min={0}
              max={255}
              step={1}
            />
          )}

          {activeFilter === 'blur' && (
            <Slider
              label="Blur Radius"
              value={filterSettings.blur}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, blur: value })
              }
              min={1}
              max={10}
              step={1}
            />
          )}

          {activeFilter === 'sharpen' && (
            <Slider
              label="Sharpen Amount"
              value={filterSettings.sharpen}
              onChange={(value) =>
                onSettingsChange({ ...filterSettings, sharpen: value })
              }
              min={0}
              max={3}
              step={0.1}
            />
          )}
        </div>
      )}
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default FiltersPanel;
