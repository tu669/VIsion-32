import { useState } from 'react';
import { useImageProcessing } from '@/hooks/useImageProcessing';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import ModeTabs from '@/components/ModeTabs';
import ImageUploader from '@/components/ImageUploader';
import FiltersPanel from '@/components/FiltersPanel';
import RGBPanel from '@/components/RGBPanel';
import OriginalCanvas from '@/components/OriginalCanvas';
import ProcessedCanvas from '@/components/ProcessedCanvas';
import ApplyButton from '@/components/ApplyButton';
import DownloadButton from '@/components/DownloadButton';
import ESP32Control from '@/components/ESP32Control';
import { Button } from '@/components/ui/button';
import { Cable } from 'lucide-react';

const Dashboard = () => {
  const [mode, setMode] = useState<'dashboard' | 'filters' | 'rgb' | 'esp32' | 'settings'>('dashboard');
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
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar activeMode={mode} onModeChange={setMode} />

        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-primary/20 glass-card rounded-none px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-foreground hover:text-primary transition-colors" />
              <h1 className="text-3xl font-bold text-gradient">Vision-32 Dashboard</h1>
            </div>
            <Button
              size="icon"
              className="animate-pulse-glow rounded-xl"
            >
              <Cable className="h-5 w-5" />
            </Button>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {mode === 'dashboard' && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-12 text-center">
                  <h2 className="text-4xl font-bold text-gradient mb-4">Welcome to Vision-32</h2>
                  <p className="text-foreground/70 text-lg">Select a mode from the sidebar to get started</p>
                </div>
              </div>
            )}

            {mode === 'settings' && (
              <div className="space-y-6">
                <div className="glass-card rounded-2xl p-12 text-center">
                  <h2 className="text-4xl font-bold text-gradient mb-4">Settings</h2>
                  <p className="text-foreground/70 text-lg">Configuration options coming soon</p>
                </div>
              </div>
            )}

            {mode === 'esp32' && <ESP32Control />}

            {(mode === 'filters' || mode === 'rgb') && (
              <div className="space-y-6">
                {/* Mode Tabs */}
                <ModeTabs 
                  activeMode={mode === 'filters' ? 'filters' : 'rgb'} 
                  onModeChange={(m) => setMode(m as any)} 
                />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
                  <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <OriginalCanvas canvasRef={originalCanvasRef} />
                    <ProcessedCanvas canvasRef={processedCanvasRef} />
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
