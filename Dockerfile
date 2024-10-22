FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

WORKDIR /usr/src/app

# Copy package.json, pnpm-lock.yaml and .npmrc (if you have one)
COPY package.json pnpm-lock.yaml .npmrc* ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
