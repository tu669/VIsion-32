import { RefObject } from 'react';

interface OriginalCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const OriginalCanvas = ({ canvasRef }: OriginalCanvasProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
      <h3 className="text-sm font-semibold text-foreground mb-4">Original Image</h3>
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

export default OriginalCanvas;
