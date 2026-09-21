# syntax=docker/dockerfile:1

# --- deps: install dependency (layer ter-cache selama lockfile tidak berubah) ---
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- build: type-check + build production ---
FROM deps AS build
# Vite menanamkan nilai ini saat build, bukan saat container berjalan.
# Harus alamat backend yang bisa dijangkau BROWSER.
ARG VITE_API_BASE_URL=http://localhost:8000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
COPY . .
RUN pnpm build

# --- runtime: file statis lewat nginx ---
FROM nginx:alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
