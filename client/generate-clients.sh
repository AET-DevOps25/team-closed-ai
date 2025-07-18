generate_client() {
    local service_name=$1
    local api_url=$2
    local output_dir=$3
    
    echo "📦 Generating client for $service_name..."
    echo "   API URL: $api_url"
    echo "   Output directory: $output_dir"
    
    openapi-generator generate \
        -i "$api_url" \
        -o "$output_dir" \
        -g typescript-axios \
        --skip-validate-spec
    
    echo "✅ Successfully generated client for $service_name"
    echo ""
}

# Generate Server API client
generate_client \
    "Server" \
    "../server/openapi.yaml" \
    "src/api/server"

# Generate Gen AI Service API client
generate_client \
    "Gen AI Service" \
    "../genai/openapi.yaml" \
    "src/api/genai"