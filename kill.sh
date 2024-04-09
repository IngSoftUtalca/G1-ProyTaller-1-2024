#!/bin/bash

# Lista de puertos a verificar
puertos=(3000 3001 3002 3003 3004 3005 3006 3007 3008 3009 3010 3011 3012 3013 3014)

# Itera sobre cada puerto y detiene el servicio que lo está utilizando
for puerto in "${puertos[@]}"; do
    echo "Deteniendo servicio en el puerto $puerto..."
    lsof -i :$puerto | awk 'NR!=1 {print $2}' | xargs kill -9
done

# Muestra el estado de los procesos después de detenerlos
echo "Estado de los procesos después de detenerlos:"
for puerto in "${puertos[@]}"; do
    lsof -i :$puerto
done

