FROM ocaml/opam:debian-12-ocaml-5.1

WORKDIR /app
COPY . .

RUN sudo apt-get update && sudo apt-get install -y --no-install-recommends \
	gcc \
	make \
	libc6-dev \
 && sudo rm -rf /var/lib/apt/lists/*

RUN sudo chown -R opam:opam /app
USER opam

RUN opam update \
 && opam install -y dune

RUN cd backend && opam exec -- dune build bin/main.exe

EXPOSE 8080
CMD ["./backend/_build/default/bin/main.exe"]
