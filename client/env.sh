#!/bin/sh
echo "Injecting runtime API URL: $VITE_API_URL"

find /app/dist -type f -name '*.js' -exec sed -i "s|__API_URL_PLACEHOLDER__|${VITE_API_URL}|g" '{}' +

echo "Starting server..."
exec serve -s /app/dist
