# Dockerfile for back-end
FROM node:18.0.0-alpine as base
WORKDIR /usr/project/back-end
EXPOSE 3000:3000

FROM base as test
ENV NODE_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    --mount=type=bind,source=./,target=/usr/project/back-end \
    npm ci --include=dev
USER node
COPY . .
RUN npm run lint
RUN npm run test

FROM base as dev
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY --chown=node . /usr/project/back-end
# Setting env variable seems to not through package.json in docker containers, so have to do it here
ENV NODE_ENV=development 
CMD ["npm", "run", "dev"]


FROM base as prod
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev
USER node
COPY --chown=node . /usr/project/back-end
# Setting env variable seems to not through package.json in docker containers, so have to do it here
ENV NODE_ENV=production 
CMD ["npm", "run", "prod"]