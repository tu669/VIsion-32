import React, { useState } from "react";
import { useEsp32Serial, modeNames } from "../hooks/useEsp32Serial";

// Card styling
const cardStyle: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 16,
  padding: 24,
  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  border: "1px solid #e5e5ea",
};

const sectionTitle: React.CSSProperties = {
  fontSize: "1.1rem",
  fontWeight: 600,
  marginBottom: 12,
};

const statusDotBase: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  marginRight: 8,
};

const ESP32Control: React.FC = () => {
  const {
    isSupported,
    isConnected,
    currentMode,
    setMode,
    updateParam,
    consoleLogs,
    connectSerial,
  } = useEsp32Serial();

  // UI sliders (same parameters as ESP HTML)
  const [bwThreshold, setBwThreshold] = useState(100);
  const [satFactor, setSatFactor] = useState(2.0);
  const [brightnessOffset, setBrightnessOffset] = useState(-50);
  const [contrastEnh, setContrastEnh] = useState(1.2);
  const [brightnessEnh, setBrightnessEnh] = useState(50);
  const [segThreshold, setSegThreshold] = useState(120);

  const disabled = !isConnected;

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
          alignItems: "center",
        }}
      >
        <div>
          <h2 style={{ margin: 0, fontSize: "1.3rem" }}>
            ESP32 Control Dashboard
          </h2>
          <p style={{ margin: 0, color: "#6b7280", fontSize: "0.9rem" }}>
            Real-time filter control via Web Serial
          </p>
        </div>

        <button
          onClick={connectSerial}
          disabled={isConnected || !isSupported}
          style={{
            padding: "8px 16px",
            borderRadius: 999,
            border: "none",
            background: isConnected ? "#16a34a" : "#2563eb",
            color: "#fff",
            fontWeight: 600,
            cursor: isConnected ? "default" : "pointer",
            opacity: !isSupported ? 0.6 : 1,
          }}
        >
          {isSupported
            ? isConnected
              ? "Connected ✓"
              : "Connect ESP32"
            : "Web Serial not supported"}
        </button>
      </div>

      {/* Connection status */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 24,
          fontSize: "0.9rem",
          color: "#4b5563",
        }}
      >
        <span
          style={{
            ...statusDotBase,
            backgroundColor: isConnected ? "#16a34a" : "#ef4444",
          }}
        />
        <span>{isConnected ? "Connected to ESP32" : "Not connected"}</span>
      </div>

      {/* Filter modes */}
      <div style={{ marginBottom: 24 }}>
        <div style={sectionTitle}>Image Processing Modes</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: 8,
          }}
        >
          {modeNames.map((name, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => setMode(idx)}
              style={{
                padding: "10px 12px",
                borderRadius: 999,
                border:
                  currentMode === idx
                    ? "1px solid #2563eb"
                    : "1px solid #e5e7eb",
                background:
                  currentMode === idx ? "rgba(37,99,235,0.08)" : "#ffffff",
                fontSize: "0.9rem",
                fontWeight: 500,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Active mode */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Active Filter
        </div>
        <div style={{ fontSize: "1.4rem", fontWeight: 600 }}>
          {currentMode != null ? modeNames[currentMode] : "—"}
        </div>
      </div>

      {/* Sliders (all ESP32 parameters) */}
      <div style={{ marginBottom: 24 }}>
        <div style={sectionTitle}>Filter Parameters</div>

        <ParamSlider
          label="B&W Threshold"
          value={bwThreshold}
          min={0}
          max={255}
          step={1}
          disabled={disabled}
          onChange={(v) => {
            setBwThreshold(v);
            updateParam("bwThreshold", v);
          }}
        />

        <ParamSlider
          label="Saturation Factor"
          value={satFactor}
          min={0}
          max={5}
          step={0.1}
          disabled={disabled}
          onChange={(v) => {
            setSatFactor(v);
            updateParam("satFactor", v);
          }}
        />

        <ParamSlider
          label="Brightness Offset"
          value={brightnessOffset}
          min={-100}
          max={100}
          step={1}
          disabled={disabled}
          onChange={(v) => {
            setBrightnessOffset(v);
            updateParam("brightnessOffset", v);
          }}
        />

        <ParamSlider
          label="Contrast Enhancement"
          value={contrastEnh}
          min={0.5}
          max={3}
          step={0.1}
          disabled={disabled}
          onChange={(v) => {
            setContrastEnh(v);
            updateParam("contrastEnh", v);
          }}
        />

        <ParamSlider
          label="Brightness Enhancement"
          value={brightnessEnh}
          min={-100}
          max={100}
          step={1}
          disabled={disabled}
          onChange={(v) => {
            setBrightnessEnh(v);
            updateParam("brightnessEnh", v);
          }}
        />

        <ParamSlider
          label="Segment Threshold"
          value={segThreshold}
          min={0}
          max={255}
          step={1}
          disabled={disabled}
          onChange={(v) => {
            setSegThreshold(v);
            updateParam("segThreshold", v);
          }}
        />
      </div>

      {/* Serial console */}
      <div>
        <div style={sectionTitle}>Serial Debug Monitor</div>

        <div
          style={{
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            background: "#f9fafb",
            padding: 12,
            maxHeight: 220,
            overflowY: "auto",
            fontFamily:
              "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas",
            fontSize: "0.8rem",
          }}
        >
          {consoleLogs.length === 0 ? (
            <div style={{ color: "#9ca3af", fontStyle: "italic" }}>
              Waiting for ESP32 data…
            </div>
          ) : (
            consoleLogs.map((log, i) => (
              <div key={i} style={{ marginBottom: 4 }}>
                [{log.timestamp}] {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ESP32Control;

// Slider component
interface ParamSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
  onChange: (v: number) => void;
}

const ParamSlider: React.FC<ParamSliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  disabled,
  onChange,
}) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.9rem",
          marginBottom: 4,
        }}
      >
        <span>{label}</span>
        <span style={{ fontFamily: "monospace" }}>{value}</span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};
