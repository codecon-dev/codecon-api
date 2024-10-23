FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy package.json, pnpm-lock.yaml and .npmrc (if you have one)
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

# Copy the docker-entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
