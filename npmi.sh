#!/bin/bash

# Encuentra todos los subdirectorios con un archivo package.json
for dir in $(find . -type d -name "node_modules" -prune -o -type f -name "package.json" -exec dirname {} \;); do
  echo "Instalando dependencias en $dir"
  (cd "$dir" && npm install)
done
