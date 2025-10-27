#!/bin/bash
echo "⚙️ Configurando entorno de integración para PRIME Gamificación..."

# Crear carpeta temporal de build
mkdir -p build

# Variables de entorno para integración
export NODE_ENV=production
export VITE_URL_BASE_API=https://prime-api-iawe.onrender.com/

# Instalar dependencias
npm ci

# Compilar el proyecto
npm run build

echo "✅ Entorno de liberación generado correctamente."
