import { Button } from '@/components/ui/button';

interface ModeTabsProps {
  activeMode: 'filters' | 'rgb';
  onModeChange: (mode: 'filters' | 'rgb') => void;
}

const ModeTabs = ({ activeMode, onModeChange }: ModeTabsProps) => {
  return (
    <div className="flex gap-3">
      <Button
        variant={activeMode === 'filters' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onModeChange('filters')}
        className={`min-w-[140px] transition-all duration-300 rounded-xl ${
          activeMode === 'filters'
            ? 'bg-primary text-primary-foreground animate-pulse-glow'
            : 'glass-card hover:border-primary/60'
        }`}
      >
        Filters Mode
      </Button>
      <Button
        variant={activeMode === 'rgb' ? 'default' : 'outline'}
        size="lg"
        onClick={() => onModeChange('rgb')}
        className={`min-w-[140px] transition-all duration-300 rounded-xl ${
          activeMode === 'rgb'
            ? 'bg-primary text-primary-foreground animate-pulse-glow'
            : 'glass-card hover:border-primary/60'
        }`}
      >
        RGB Mode
      </Button>
    </div>
  );
};

export default ModeTabs;
