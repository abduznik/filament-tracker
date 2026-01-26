# Filament Tracker

A modern, local-first dashboard to track your 3D printer filament inventory.

## Features

*   Inventory Management: Track filaments by brand, color, material, and weight.
*   Usage Logging: Log every print job or restock to calculate usage rates.
*   Visual Tracking: Upload photos of your spools for easy identification.
*   Offline First: All data is stored locally in your browser (IndexedDB).
*   Mobile Friendly: Responsive design works great on phones and tablets.

## Tech Stack

*   Frontend: React + TypeScript + Vite
*   Styling: Tailwind CSS
*   Database: Dexie.js (IndexedDB wrapper)
*   State: React Hooks + Zustand (Ready)

## Installation

1.  Clone the repo:
    ```bash
    git clone https://github.com/abduznik/filament-tracker.git
    cd filament-tracker
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start development server:
    ```bash
    npm run dev
    ```

## Docker / Homelab

To build for production (static site):
```bash
npm run build
```
You can serve the dist folder with any static file server (Nginx, Apache, Caddy).

## Contributing

Check the Issues tab for planned features!
