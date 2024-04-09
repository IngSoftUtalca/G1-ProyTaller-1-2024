#!/bin/bash

# Navegar al directorio principal
cd ./
#!/bin/bash

# Navegar al directorio principal
cd ./

# Ejecutar npm start o vue serve en cada subdirectorio
for dir in */; do
    cd "$dir"
    
    # Verificar si es un proyecto Node.js y no es un proyecto Vue
    if [ -f "package.json" ] && [ ! -f "vue.config.js" ]; then
        npm start &
    fi
    
    # Verificar si es un proyecto Vue
    if [ -f "vue.config.js" ]; then
        npm run serve &
    fi
    
    cd ..
done

