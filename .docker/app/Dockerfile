FROM node:22
LABEL authors="kalat"

ENV PNPM_HOME="/tmp/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN npm i -g pnpm && \
    pnpm config set store-dir /pnpm_store && \
    pnpm approve-builds


