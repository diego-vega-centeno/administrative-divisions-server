# syntax=docker/dockerfile:1


# Deps stage: install production dependencies only.
FROM dhi.io/node:24-alpine3.23-dev AS deps

WORKDIR /app

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    npm ci --omit=dev


# Runner stage: minimal runtime image with compiled app and production deps.
FROM dhi.io/node:24-alpine3.23 AS runner

ENV PATH=/app/node_modules/.bin:$PATH

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD ["node", "app.js"]