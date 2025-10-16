# ====== Build Stage ======
FROM node:22-alpine AS builder
WORKDIR /app

# Copia apenas os package.json do front
COPY frontend/package*.json ./

# Instala dependências
RUN npm install --frozen-lockfile

# Passa variáveis de ambiente como ARG
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_VERSION
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Define ENV para o build
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_APP_NAME=${NEXT_PUBLIC_APP_NAME}
ENV NEXT_PUBLIC_APP_VERSION=${NEXT_PUBLIC_APP_VERSION}
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=${NEXT_PUBLIC_RECAPTCHA_SITE_KEY}

# Copia o restante do código
COPY frontend ./

# Garante que a pasta public exista (mesmo se não houver no repo)
RUN mkdir -p public

# Build do Next.js
RUN npm run build

# ====== Production Stage ======
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copia apenas o necessário do builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["npm", "start"]
