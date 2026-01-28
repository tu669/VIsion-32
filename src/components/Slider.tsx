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
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color || 'hsl(var(--primary))'};
          cursor: pointer;
          box-shadow: 0 0 15px ${color ? `${color}88` : 'rgba(123, 92, 255, 0.6)'}, 0 2px 8px rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
        }
        .slider::-webkit-slider-thumb:hover {
          box-shadow: 0 0 25px ${color ? `${color}` : 'rgba(123, 92, 255, 0.8)'}, 0 2px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }
        .slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: ${color || 'hsl(var(--primary))'};
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 0 15px ${color ? `${color}88` : 'rgba(123, 92, 255, 0.6)'}, 0 2px 8px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        .slider::-moz-range-thumb:hover {
          box-shadow: 0 0 25px ${color ? `${color}` : 'rgba(123, 92, 255, 0.8)'}, 0 2px 12px rgba(0, 0, 0, 0.4);
          transform: scale(1.1);
        }
        .slider::-webkit-slider-runnable-track {
          background: hsl(var(--secondary));
          border-radius: 0.5rem;
          height: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
        .slider::-moz-range-track {
          background: hsl(var(--secondary));
          border-radius: 0.5rem;
          height: 0.5rem;
          border: 1px solid hsl(var(--border));
        }
      `}</style>
    </div>
  );
};

export default Slider;
