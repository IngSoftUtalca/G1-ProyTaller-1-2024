#!/bin/bash

# Navegar al directorio principal
cd ./

# Recorrer todos los subdirectorios
for dir in */; do
    cd "$dir"
    
    # Verificar si es un proyecto Node.js y no es un proyecto Vue
    if [ -f "package.json" ] && [ ! -f "vue.config.js" ]; then
        # Corregir el archivo package.json
        sed -i '$d' package.json
        sed -i '$d' package.json
    fi
    
    cd ..
done
