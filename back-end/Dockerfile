# Dockerfile for back-end
FROM node:18.0.0-alpine AS base
WORKDIR /usr/project/back-end
EXPOSE 3000:3000

FROM base AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm
COPY . /usr/project/back-end

FROM build AS dev
RUN npm ci --include=dev
ENV NODE_ENV=development
CMD npm run dev

FROM build AS prod
RUN npm run build
RUN npm ci --omit=dev
ENV NODE_ENV=production
CMD npm run prod

FROM build AS test
RUN npm ci --include=dev
RUN npm run lint
RUN npm run test