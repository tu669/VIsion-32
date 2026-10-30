import { useState, useRef, useEffect } from "react";

// Web Serial API type declarations
interface SerialPort {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
}

interface Serial {
  requestPort(): Promise<SerialPort>;
}

declare global {
  interface Navigator {
    serial: Serial;
  }
}

export interface ConsoleLog {
  timestamp: string;
  message: string;
}

// EXPORT MODE NAMES so ESP32Control.tsx can use them
export const modeNames = [
  "Normal",
  "Grayscale",
  "Black & White",
  "Saturation",
  "Brightness",
  "Enhance",
  "Segment",
  "Edge Detect",
];

export const useEsp32Serial = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentMode, setCurrentMode] = useState(0);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isSupported] = useState(() => "serial" in navigator);

  const portRef = useRef<SerialPort | null>(null);
  const writerRef =
    useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
  const readerRef =
    useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

  const isReadingRef = useRef(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs((prev) => [...prev, { timestamp, message }]);
  };

  // Read incoming ESP32 serial messages
  const readSerialData = async () => {
    if (!readerRef.current || isReadingRef.current) return;

    isReadingRef.current = true;

    try {
      while (true) {
        const { value, done } = await readerRef.current.read();
        if (done) {
          readerRef.current.releaseLock();
          break;
        }

        const text = new TextDecoder().decode(value);
        addLog(text);
      }
    } catch (err) {
      addLog("Read error: " + err);
      setIsConnected(false);
      isReadingRef.current = false;
    }
  };

  // Connect to ESP32
  const connectSerial = async () => {
    if (!isSupported) {
      alert("Web Serial API not supported.");
      return;
    }

    try {
      portRef.current = await navigator.serial.requestPort();
      await portRef.current.open({ baudRate: 115200 });

      writerRef.current = portRef.current.writable.getWriter();
      readerRef.current = portRef.current.readable.getReader();

      setIsConnected(true);
      addLog("Connected to ESP32");

      readSerialData();
    } catch (err) {
      addLog("Connection error: " + err);
    }
  };

  // Disconnect ESP32
  const disconnectSerial = async () => {
    try {
      isReadingRef.current = false;

      if (readerRef.current) {
        await readerRef.current.cancel();
        readerRef.current.releaseLock();
        readerRef.current = null;
      }

      if (writerRef.current) {
        writerRef.current.releaseLock();
        writerRef.current = null;
      }

      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }

      setIsConnected(false);
      addLog("Disconnected from ESP32");
    } catch (err) {
      addLog("Disconnect error: " + err);
    }
  };

  // Send MODE:x
  const setMode = async (mode: number) => {
    if (!isConnected) return;

    try {
      const command = `MODE:${mode}\n`;
      await writerRef.current?.write(new TextEncoder().encode(command));

      setCurrentMode(mode);
      addLog("Mode → " + modeNames[mode]);
    } catch (err) {
      addLog("Error setting mode: " + err);
    }
  };

  // Send PARAM:name:value
  const updateParam = async (param: string, value: number) => {
    if (!isConnected) return;

    try {
      const command = `PARAM:${param}:${value}\n`;
      await writerRef.current?.write(new TextEncoder().encode(command));
      addLog(`Param ${param} = ${value}`);
    } catch (err) {
      addLog("Error sending parameter: " + err);
    }
  };

  const clearConsole = () => setConsoleLogs([]);

  // ALIASES for React UI compatibility
  const connect = connectSerial;
  const sendParam = updateParam;
  const logs = consoleLogs;

  useEffect(() => {
    return () => {
      disconnectSerial();
    };
  }, []);

  return {
    // original
    connectSerial,
    disconnectSerial,
    updateParam,
    consoleLogs,

    // React UI friendly aliases
    connect,
    sendParam,
    logs,

    // shared
    isConnected,
    isSupported,
    currentMode,
    setMode,
    clearConsole,
    modeNames,
  };
};
