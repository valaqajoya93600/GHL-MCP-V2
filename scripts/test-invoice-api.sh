#!/bin/bash

# Invoice API Tester
# This script helps debug invoice API issues

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo "Please create .env file with:"
    echo "  GHL_API_KEY=pit-xxxxx"
    echo "  GHL_LOCATION_ID=xxxxx"
    echo "  GHL_BASE_URL=https://services.leadconnectorhq.com"
    exit 1
fi

# Load environment variables
export $(cat .env | xargs)

if [ -z "$GHL_API_KEY" ]; then
    print_error "GHL_API_KEY not set in .env"
    exit 1
fi

if [ -z "$GHL_LOCATION_ID" ]; then
    print_error "GHL_LOCATION_ID not set in .env"
    exit 1
fi

API_KEY=${GHL_API_KEY}
LOCATION_ID=${GHL_LOCATION_ID}
BASE_URL=${GHL_BASE_URL:-https://services.leadconnectorhq.com}
VERSION="2021-07-28"

print_step "Invoice API Diagnostic Test"
echo "API Key: ${API_KEY:0:10}...${API_KEY: -5}"
echo "Location ID: $LOCATION_ID"
echo "Base URL: $BASE_URL"
echo ""

# Test 1: Check API Key Validity
print_step "Test 1: Checking API Key Validity"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/locations/" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: $VERSION" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "API Key is valid"
    LOCATION_COUNT=$(echo "$BODY" | grep -o '"id"' | wc -l)
    echo "Found $LOCATION_COUNT location(s)"
else
    print_error "API Key validation failed (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

echo ""

# Test 2: Check Invoice Permissions
print_step "Test 2: Checking Invoice Permissions"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/invoices/" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: $VERSION" \
  -H "altId: $LOCATION_ID" \
  -H "altType: location" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Invoice permissions are granted"
    INVOICE_COUNT=$(echo "$BODY" | grep -o '"_id"' | wc -l)
    echo "Found $INVOICE_COUNT invoice(s)"
elif [ "$HTTP_CODE" = "403" ]; then
    print_error "Permission denied (HTTP 403)"
    echo "Check that your Private Integration has 'Invoices' scope enabled"
    echo "Response: $BODY"
else
    print_error "Failed to check permissions (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

echo ""

# Test 3: Get Invoice List with Details
print_step "Test 3: Fetching Invoice Details"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/invoices/?limit=3" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Version: $VERSION" \
  -H "altId: $LOCATION_ID" \
  -H "altType: location" \
  -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Retrieved invoice list"
    
    # Extract first invoice ID
    FIRST_INVOICE_ID=$(echo "$BODY" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -z "$FIRST_INVOICE_ID" ]; then
        print_warning "No invoices found in account"
    else
        echo "First invoice ID: $FIRST_INVOICE_ID"
        
        echo ""
        
        # Test 4: Get specific invoice details
        print_step "Test 4: Getting Specific Invoice Details"
        RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/invoices/$FIRST_INVOICE_ID" \
          -H "Authorization: Bearer $API_KEY" \
          -H "Version: $VERSION" \
          -H "altId: $LOCATION_ID" \
          -H "altType: location" \
          -H "Content-Type: application/json")
        
        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        BODY=$(echo "$RESPONSE" | head -n-1)
        
        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Retrieved invoice details"
            
            STATUS=$(echo "$BODY" | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
            echo "Invoice Status: $STATUS"
            
            # Show the full response (pretty printed if jq available)
            if command -v jq &> /dev/null; then
                echo ""
                echo "Full invoice details:"
                echo "$BODY" | jq '.'
            else
                echo ""
                echo "Full response:"
                echo "$BODY"
            fi
            
            # Test 5: Try to send invoice
            if [ "$STATUS" = "draft" ]; then
                echo ""
                print_step "Test 5: Attempting to Send Invoice"
                
                RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/invoices/$FIRST_INVOICE_ID/send" \
                  -H "Authorization: Bearer $API_KEY" \
                  -H "Version: $VERSION" \
                  -H "altId: $LOCATION_ID" \
                  -H "altType: location" \
                  -H "Content-Type: application/json" \
                  -d '{
                    "action": "send_manually"
                  }')
                
                HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
                BODY=$(echo "$RESPONSE" | head -n-1)
                
                if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "201" ]; then
                    print_success "Invoice sent successfully!"
                    echo "Response: $BODY"
                else
                    print_error "Failed to send invoice (HTTP $HTTP_CODE)"
                    echo "Response: $BODY"
                fi
            else
                print_warning "Invoice status is '$STATUS', not 'draft' - cannot test send"
            fi
        else
            print_error "Failed to get invoice details (HTTP $HTTP_CODE)"
            echo "Response: $BODY"
        fi
    fi
else
    print_error "Failed to fetch invoice list (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
fi

echo ""
print_step "Test Complete"
echo "If all tests passed, your API configuration is correct!"
echo "If tests failed, check TROUBLESHOOTING_403_FORBIDDEN.md"
