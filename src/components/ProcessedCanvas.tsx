import { RefObject } from 'react';

interface ProcessedCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

const ProcessedCanvas = ({ canvasRef }: ProcessedCanvasProps) => {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-lg font-bold text-gradient mb-4">Processed Image</h3>
      <div className="bg-card/20 rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] border-glow-accent">
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
