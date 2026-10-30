import { RefObject } from 'react';

interface ProcessedCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const ProcessedCanvas = ({ canvasRef }: ProcessedCanvasProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Processed Image</h3>
      <div className="bg-secondary/30 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
        <canvas
          ref={canvasRef}
          className="max-w-full h-auto"
          style={{ imageRendering: 'auto' }}
        />
      </div>
    </div>
  );
};

export default ProcessedCanvas;
