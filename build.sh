#!/bin/bash

# Instalar todas las dependencias
npm install

# Construir el frontend
NODE_ENV=production ./node_modules/.bin/vite build

# Construir el backend
./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist