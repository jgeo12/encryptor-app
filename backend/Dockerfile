FROM ocaml/ocaml:latest-alpine

WORKDIR /app
COPY . .

RUN apk add --no-cache dune gcc musl-dev
RUN dune build bin/main.exe

EXPOSE 8080
CMD ["./_build/default/bin/main.exe"]