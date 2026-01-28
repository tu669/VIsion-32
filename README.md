# Vision 32 – Web Dashboard

This directory contains the web-based control and monitoring dashboard
for the Vision 32 embedded image processing system.

## Overview
The dashboard provides real-time visualization and control of the ESP32-S3
based image processing unit. It communicates with the device over Wi-Fi
using HTTP endpoints.

## Tech Stack
- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn-ui

## Features
- Live video streaming
- Camera parameter control
- System metrics monitoring (Heap, RSSI)

## Run Locally
```bash
npm install
npm run dev
