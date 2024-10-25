FROM node:18

# Install build essentials
RUN apt-get update && apt-get install -y build-essential python3

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json, pnpm-lock.yaml and .npmrc (if you have one)
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install dependencies using pnpm, forcing bcrypt to be built from source
RUN pnpm install --frozen-lockfile --no-optional && \
    npm rebuild bcrypt --build-from-source

COPY . .
COPY .env .env

RUN pnpm run build

EXPOSE 3000

# Copy the docker-entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Add an environment variable to control database reset
ENV RESET_DB=false

# Modify the CMD to check for database reset
CMD ["sh", "-c", "if [ \"$RESET_DB\" = \"true\" ]; then pnpm run db:reset; else /docker-entrypoint.sh; fi"]

