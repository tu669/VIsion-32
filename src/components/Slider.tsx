interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  color?: string;
}

const Slider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  color,
}: SliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-sm text-muted-foreground font-mono">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer slider"
        style={
          color
            ? ({
                '--slider-color': color,
              } as React.CSSProperties)
            : undefined
        }
      />
      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${color || 'hsl(var(--primary))'};
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: ${color || 'hsl(var(--primary))'};
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .slider::-webkit-slider-runnable-track {
          background: hsl(var(--secondary));
          border-radius: 0.5rem;
          height: 0.5rem;
        }
        .slider::-moz-range-track {
          background: hsl(var(--secondary));
          border-radius: 0.5rem;
          height: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default Slider;
