const ESP32Control = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-6 border-b border-primary/20">
        <h3 className="text-xl font-bold text-gradient">ESP32 Control Dashboard</h3>
      </div>
      <div className="relative">
        <iframe
          src="/esp32_control_page_dark.html"
          className="w-full border-0 rounded-b-2xl bg-card/20"
          style={{ height: 'calc(100vh - 200px)' }}
          title="ESP32 Control Dashboard"
          allow="serial"
        />
      </div>
    </div>
  );
};

export default ESP32Control;
