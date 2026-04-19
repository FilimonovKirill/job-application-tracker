#!/bin/bash

# MongoDB Restore Script
# Usage: ./restore.sh [backup_file.tar.gz]

set -e

if [ -z "$1" ]; then
    echo "Usage: $0 [backup_file.tar.gz]"
    exit 1
fi

BACKUP_FILE="$1"
MONGO_HOST=${MONGO_HOST:-mongodb}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_USER=${MONGO_USER:-admin}
MONGO_PASSWORD=${MONGO_PASSWORD:-password}
BACKUP_DIR=${BACKUP_DIR:-/backup}
TEMP_DIR="/tmp/mongo_restore_$(date +%s)"

if [ ! -f "$BACKUP_FILE" ]; then
    if [ -f "$BACKUP_DIR/$BACKUP_FILE" ]; then
        BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    else
        echo "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
fi

echo "Starting restore from backup: $BACKUP_FILE"

# Extract backup
mkdir -p "$TEMP_DIR"
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

# Find the extracted directory
EXTRACTED_DIR=$(find "$TEMP_DIR" -type d -name "job_tracker" -o -type d -name "20*" | head -1)

if [ -z "$EXTRACTED_DIR" ]; then
    echo "Could not find extracted backup data"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "Restoring from directory: $EXTRACTED_DIR"

# Restore database
mongorestore \
  --host="$MONGO_HOST:$MONGO_PORT" \
  --username="$MONGO_USER" \
  --password="$MONGO_PASSWORD" \
  --authenticationDatabase="admin" \
  --drop \
  "$EXTRACTED_DIR"

# Cleanup
rm -rf "$TEMP_DIR"

echo "Restore completed successfully"