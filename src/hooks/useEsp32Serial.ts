import { useState, useRef, useEffect } from 'react';

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

interface ConsoleLog {
  timestamp: string;
  message: string;
}

interface UseEsp32SerialReturn {
  connectSerial: () => Promise<void>;
  disconnectSerial: () => Promise<void>;
  isConnected: boolean;
  currentMode: number;
  setMode: (mode: number) => Promise<void>;
  updateParam: (param: string, value: string | number) => Promise<void>;
  consoleLogs: ConsoleLog[];
  clearConsole: () => void;
  isSupported: boolean;
}

const modeNames = [
  'Normal',
  'Grayscale',
  'Black & White',
  'Saturation',
  'Brightness',
  'Enhance',
  'Segment',
  'Edge Detect'
];

export const useEsp32Serial = (): UseEsp32SerialReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const [currentMode, setCurrentMode] = useState(5); // Default to Enhance
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLog[]>([]);
  const [isSupported] = useState(() => 'serial' in navigator);

  const portRef = useRef<SerialPort | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter<Uint8Array> | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const isReadingRef = useRef(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLogs(prev => [...prev, { timestamp, message }]);
  };

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
        addLog(`ESP32: ${text}`);
      }
    } catch (error) {
      console.error('Read error:', error);
      addLog(`Read error: ${error}`);
      setIsConnected(false);
      isReadingRef.current = false;
    }
  };

  const connectSerial = async () => {
    if (!isSupported) {
      alert('Web Serial API not supported. Please use Chrome, Edge, or Opera browser.');
      return;
    }

    try {
      portRef.current = await navigator.serial.requestPort();
      await portRef.current.open({ baudRate: 115200 });
      
      writerRef.current = portRef.current.writable.getWriter();
      readerRef.current = portRef.current.readable.getReader();
      
      setIsConnected(true);
      addLog('Connected to ESP32');
      
      readSerialData();
      
    } catch (error) {
      console.error('Connection error:', error);
      addLog(`Connection error: ${error}`);
      alert('Failed to connect. Make sure you selected the correct port!');
    }
  };

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
      addLog('Disconnected from ESP32');
    } catch (error) {
      console.error('Disconnect error:', error);
      addLog(`Disconnect error: ${error}`);
    }
  };

  const setMode = async (mode: number) => {
    if (!isConnected) {
      alert('Please connect to ESP32 first!');
      return;
    }
    
    if (!writerRef.current) {
      addLog('Writer not available');
      return;
    }
    
    try {
      const command = `MODE:${mode}\n`;
      const encoder = new TextEncoder();
      await writerRef.current.write(encoder.encode(command));
      
      setCurrentMode(mode);
      addLog(`Mode changed to: ${modeNames[mode]}`);
      
    } catch (error) {
      console.error('Error sending command:', error);
      addLog(`Error sending command: ${error}`);
    }
  };

  const updateParam = async (param: string, value: string | number) => {
    if (!isConnected) return;
    
    if (!writerRef.current) {
      addLog('Writer not available');
      return;
    }
    
    try {
      const command = `PARAM:${param}:${value}\n`;
      const encoder = new TextEncoder();
      await writerRef.current.write(encoder.encode(command));
      addLog(`Parameter ${param} set to ${value}`);
    } catch (error) {
      console.error('Error sending parameter:', error);
      addLog(`Error sending parameter: ${error}`);
    }
  };

  const clearConsole = () => {
    setConsoleLogs([]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectSerial();
    };
  }, []);

  return {
    connectSerial,
    disconnectSerial,
    isConnected,
    currentMode,
    setMode,
    updateParam,
    consoleLogs,
    clearConsole,
    isSupported
  };
};
