FROM ocaml/opam:debian-12-ocaml-5.1

WORKDIR /app
COPY . .

RUN apk add --no-cache dune gcc musl-dev
RUN cd backend && dune build bin/main.exe

EXPOSE 8080
CMD ["backend/./_build/default/bin/main.exe"]
