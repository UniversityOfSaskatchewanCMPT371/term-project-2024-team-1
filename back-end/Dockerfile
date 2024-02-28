FROM node:18.0.0-alpine AS base
WORKDIR /usr/project/back-end
EXPOSE 3000:3000

###########################################################################################################################################################################################

FROM base AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm
COPY . /usr/project/back-end
RUN npm ci --include=dev && \
    npm run lint && \
    npm run unit-tests && \
    npm run build

############################################################################################################################################################################################

FROM build AS dev
ENV NODE_ENV=development
CMD ["sh", "-c", "npx db-migrate up --config src/resources/database/database.json -m src/resources/database/migrations && npm run dev"]

############################################################################################################################################################################################

FROM base AS prod
WORKDIR /usr/project/back-end
COPY --from=build /usr/project/back-end/build ./build
COPY package.json .
COPY package-lock.json .
RUN npm ci --omit=dev
ENV NODE_ENV=production
CMD npm run prod

############################################################################################################################################################################################

# FROM build AS test
# RUN npm run lint
# RUN npm run test