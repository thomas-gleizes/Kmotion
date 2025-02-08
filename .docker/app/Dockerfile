FROM node:22
LABEL authors="kalat"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm i -g pnpm && \
    pnpm config set store-dir /pnpm_store && \
    pnpm approve-builds


