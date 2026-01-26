# Filament Tracker

**[Live Demo](https://abduznik.github.io/filament-tracker/)**

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

You can run this application as a personal containerized package. The image is automatically built and updated only when a new version is released.

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  filament-tracker:
    image: ghcr.io/abduznik/filament-tracker:latest
    container_name: filament-tracker
    restart: unless-stopped
    ports:
      - "8082:8082"
    volumes:
      # Persist the SQLite database
      - ./data:/app/data
```

Run it with:
```bash
docker-compose up -d
```

Open `http://localhost:8082` in your browser. This containerized version uses a SQLite database stored in the `./data` volume, so your data persists even if you recreate the container.

## Contributing

Check the Issues tab for planned features!
