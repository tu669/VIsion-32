import { Button } from '@/components/ui/button';

interface ModeTabsProps {
  activeMode: 'filters' | 'rgb' | 'esp32';
  onModeChange: (mode: 'filters' | 'rgb' | 'esp32') => void;
}

const ModeTabs = ({ activeMode, onModeChange }: ModeTabsProps) => {
  return (
    <div className="flex gap-2 p-1 bg-secondary rounded-lg w-fit">
      <Button
        variant={activeMode === 'filters' ? 'default' : 'ghost'}
        size="lg"
        onClick={() => onModeChange('filters')}
        className="min-w-[140px] transition-all"
      >
        Filters Mode
      </Button>
      <Button
        variant={activeMode === 'rgb' ? 'default' : 'ghost'}
        size="lg"
        onClick={() => onModeChange('rgb')}
        className="min-w-[140px] transition-all"
      >
        RGB Mode
      </Button>
      <Button
        variant={activeMode === 'esp32' ? 'default' : 'ghost'}
        size="lg"
        onClick={() => onModeChange('esp32')}
        className="min-w-[140px] transition-all"
      >
        ESP32 Control Mode
      </Button>
    </div>
  );
};

export default ModeTabs;
