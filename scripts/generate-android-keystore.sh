#!/bin/bash

# Script to generate Android release keystore for app signing
# This creates a proper release keystore (not debug) for publishing

set -e

KEYSTORE_DIR="${KEYSTORE_DIR:-src-tauri/gen/android/keystore}"
KEYSTORE_NAME="${KEYSTORE_NAME:-release-key.jks}"
KEYSTORE_PATH="$KEYSTORE_DIR/$KEYSTORE_NAME"
KEY_ALIAS="${KEY_ALIAS:-roboticela}"

echo "🔐 Android Release Keystore Generator"
echo "======================================"
echo ""

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ Error: keytool not found. Please install JDK."
    echo "   On Ubuntu/Debian: sudo apt-get install openjdk-17-jdk"
    echo "   On macOS: brew install openjdk@17"
    exit 1
fi

# Create keystore directory if it doesn't exist
mkdir -p "$KEYSTORE_DIR"

# Check if keystore already exists
if [ -f "$KEYSTORE_PATH" ]; then
    echo "⚠️  Keystore already exists at: $KEYSTORE_PATH"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted. Using existing keystore."
        exit 0
    fi
    rm -f "$KEYSTORE_PATH"
fi

echo "Generating release keystore..."
echo "Location: $KEYSTORE_PATH"
echo "Alias: $KEY_ALIAS"
echo ""

# Prompt for keystore password
read -sp "Enter keystore password (min 6 characters): " KEYSTORE_PASSWORD
echo
if [ ${#KEYSTORE_PASSWORD} -lt 6 ]; then
    echo "❌ Error: Password must be at least 6 characters"
    exit 1
fi

# Prompt for key password (can be same as keystore password)
read -sp "Enter key password (press Enter to use same as keystore): " KEY_PASSWORD
echo
if [ -z "$KEY_PASSWORD" ]; then
    KEY_PASSWORD="$KEYSTORE_PASSWORD"
fi

# Prompt for certificate information
echo ""
echo "Enter certificate information:"
read -p "Your name or organization name: " NAME
read -p "Organizational Unit (OU) [optional]: " OU
read -p "Organization (O) [optional]: " ORG
read -p "City/Locality (L) [optional]: " CITY
read -p "State/Province (ST) [optional]: " STATE
read -p "Country Code (2 letters, e.g., US): " COUNTRY

# Build distinguished name
DN="CN=$NAME"
[ -n "$OU" ] && DN="$DN, OU=$OU"
[ -n "$ORG" ] && DN="$DN, O=$ORG"
[ -n "$CITY" ] && DN="$DN, L=$CITY"
[ -n "$STATE" ] && DN="$DN, ST=$STATE"
DN="$DN, C=$COUNTRY"

echo ""
echo "Generating keystore with the following settings:"
echo "  Algorithm: RSA"
echo "  Key size: 2048 bits"
echo "  Validity: 10000 days (~27 years)"
echo "  Distinguished Name: $DN"
echo ""

# Generate the keystore
keytool -genkeypair -v \
    -keystore "$KEYSTORE_PATH" \
    -alias "$KEY_ALIAS" \
    -keyalg RSA \
    -keysize 2048 \
    -validity 10000 \
    -storepass "$KEYSTORE_PASSWORD" \
    -keypass "$KEY_PASSWORD" \
    -dname "$DN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Keystore generated successfully!"
    echo ""
    echo "📁 Location: $KEYSTORE_PATH"
    echo "🔑 Alias: $KEY_ALIAS"
    echo ""
    echo "⚠️  IMPORTANT: Keep this keystore file and passwords safe!"
    echo "   - Without the keystore, you cannot update your app on Google Play"
    echo "   - Store passwords securely (password manager recommended)"
    echo "   - Consider backing up the keystore to a secure location"
    echo ""
    echo "📝 To use this keystore, set these environment variables:"
    echo "   export ANDROID_KEYSTORE_PATH=$KEYSTORE_PATH"
    echo "   export ANDROID_KEYSTORE_PASSWORD='$KEYSTORE_PASSWORD'"
    echo "   export ANDROID_KEY_ALIAS=$KEY_ALIAS"
    echo "   export ANDROID_KEY_PASSWORD='$KEY_PASSWORD'"
    echo ""
    echo "Or add them to your CI/CD secrets (GitHub Actions, etc.)"
else
    echo ""
    echo "❌ Failed to generate keystore"
    exit 1
fi

