import { useState } from 'react';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import ModeTabs from '@/components/ModeTabs';
import ImageUploader from '@/components/ImageUploader';
import FiltersPanel from '@/components/FiltersPanel';
import RGBPanel from '@/components/RGBPanel';
import OriginalCanvas from '@/components/OriginalCanvas';
import ProcessedCanvas from '@/components/ProcessedCanvas';
import ApplyButton from '@/components/ApplyButton';
import DownloadButton from '@/components/DownloadButton';
import ESP32Control from '@/components/ESP32Control';
import { Image } from 'lucide-react';

const Dashboard = () => {
  const [mode, setMode] = useState<'filters' | 'rgb' | 'esp32'>('filters');
  const {
    originalImage,
    imageData,
    activeFilter,
    setActiveFilter,
    filterSettings,
    setFilterSettings,
    rgbSettings,
    setRgbSettings,
    handleImageUpload,
    processImage,
    reset,
    downloadImage,
    originalCanvasRef,
    processedCanvasRef,
  } = useImageProcessing();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Image className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Image Processing Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Professional image editing with filters and RGB color correction
          </p>
        </div>

        {/* Mode Tabs */}
        <div className="mb-8">
          <ModeTabs activeMode={mode} onModeChange={setMode} />
        </div>

        {mode === 'esp32' ? (
          <ESP32Control />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Upload & Controls */}
            <div className="space-y-6">
              <ImageUploader
                onImageUpload={handleImageUpload}
                imageData={imageData}
              />

              {mode === 'filters' ? (
                <FiltersPanel
                  activeFilter={activeFilter}
                  onFilterSelect={setActiveFilter}
                  filterSettings={filterSettings}
                  onSettingsChange={setFilterSettings}
                />
              ) : (
                <RGBPanel
                  rgbSettings={rgbSettings}
                  onSettingsChange={setRgbSettings}
                />
              )}

              <div className="space-y-2">
                <ApplyButton
                  onClick={() => processImage(mode === 'filters' ? 'filter' : 'rgb')}
                  disabled={!originalImage}
                />
                <DownloadButton
                  onDownload={downloadImage}
                  onReset={reset}
                  disabled={!originalImage}
                />
              </div>
            </div>

            {/* Right Column - Canvas Display */}
            <div className="lg:col-span-2 space-y-6">
              <OriginalCanvas canvasRef={originalCanvasRef} />
              <ProcessedCanvas canvasRef={processedCanvasRef} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
