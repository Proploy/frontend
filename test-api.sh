#!/bin/bash

# API Testing Script
# This script tests all API endpoints

BASE_URL="http://localhost:3000"

echo "🧪 Testing API Endpoints..."
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local name=$1
    local url=$2
    local method=${3:-GET}
    
    echo -e "${YELLOW}Testing: ${name}${NC}"
    echo "URL: ${url}"
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$url")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Status: $http_code${NC}"
        echo "Response: $(echo "$body" | head -c 200)..."
    else
        echo -e "${RED}✗ Status: $http_code${NC}"
        echo "Response: $body"
    fi
    echo ""
}

# Check if server is running
echo "Checking if server is running..."
if ! curl -s "$BASE_URL" > /dev/null; then
    echo -e "${RED}Error: Server is not running at $BASE_URL${NC}"
    echo "Please start the server with: npm run dev"
    exit 1
fi
echo -e "${GREEN}Server is running!${NC}"
echo ""

# Test Products API
echo "================================"
echo "PRODUCTS API"
echo "================================"
test_endpoint "Get Products" "$BASE_URL/api/products?page=1&limit=5"
test_endpoint "Get Products with Search" "$BASE_URL/api/products?search=software&page=1&limit=5"
test_endpoint "Get Products with Filters" "$BASE_URL/api/products?minRating=4&page=1&limit=5"
test_endpoint "Get Products with Sorting" "$BASE_URL/api/products?sortBy=rating&sortOrder=desc&page=1&limit=5"

# Test Companies API
echo "================================"
echo "COMPANIES API"
echo "================================"
test_endpoint "Get Companies" "$BASE_URL/api/companies?page=1&limit=5"
test_endpoint "Get Companies with Search" "$BASE_URL/api/companies?search=tech&page=1&limit=5"

# Test Reviews API
echo "================================"
echo "REVIEWS API"
echo "================================"
test_endpoint "Get Reviews" "$BASE_URL/api/reviews?page=1&limit=5"
test_endpoint "Get Reviews with Filters" "$BASE_URL/api/reviews?minRating=4&page=1&limit=5"

# Test Search API
echo "================================"
echo "SEARCH API"
echo "================================"
test_endpoint "Search All" "$BASE_URL/api/search?q=software&type=all&limit=10"
test_endpoint "Search Products" "$BASE_URL/api/search?q=management&type=products&limit=10"
test_endpoint "Search Companies" "$BASE_URL/api/search?q=tech&type=companies&limit=10"

# Test Error Cases
echo "================================"
echo "ERROR HANDLING"
echo "================================"
test_endpoint "Invalid Product ID" "$BASE_URL/api/products/invalid-id-12345"
test_endpoint "Invalid Search Query" "$BASE_URL/api/search?q="

echo "================================"
echo -e "${GREEN}Testing Complete!${NC}"
echo "================================"

