#!/bin/sh

set -e

if [ "$RESET_DB" = "true" ]; then
    echo "Resetting database..."
    pnpm run db:reset
else
    echo "Skipping database reset."
fi

# Execute the command passed to docker run
exec "$@"
