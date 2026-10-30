import { Button } from '@/components/ui/button';
import { FilterType, FilterSettings } from '@/hooks/useImageProcessing';
import Slider from './Slider';

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
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">Filters</h2>
      
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
    </div>
  );
};

export default FiltersPanel;
