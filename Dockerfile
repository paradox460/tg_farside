FROM docker.io/denoland/deno:alpine AS build

RUN apk update

WORKDIR /app

COPY . /app

RUN deno compile --allow-all --output farside_bot main.ts

FROM mcr.microsoft.com/playwright:v1.56.1-noble

COPY --from=build /app/farside_bot /bin/farside_bot

VOLUME /var/cache/farside/

CMD ["/bin/farside_bot"]
