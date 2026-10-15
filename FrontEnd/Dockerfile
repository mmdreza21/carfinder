# ---------- Dependencies ----------
FROM node:24-alpine AS deps

WORKDIR /app

RUN corepack enable
RUN apk add --no-cache openssl libc6-compat

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---------- Build ----------
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable
RUN apk add --no-cache openssl libc6-compat

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
RUN yarn build

# ---------- Production ----------
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable
RUN apk add --no-cache openssl libc6-compat

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

EXPOSE 3000

CMD ["yarn", "start"]
