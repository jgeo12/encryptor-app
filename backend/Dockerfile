FROM ocaml/opam:debian-12-ocaml-5.1

WORKDIR /app
COPY . .

RUN sudo apt-get update && sudo apt-get install -y --no-install-recommends \
	gcc \
	make \
	libc6-dev \
 && sudo rm -rf /var/lib/apt/lists/*

RUN opam exec -- dune build bin/main.exe

EXPOSE 8080
CMD ["./_build/default/bin/main.exe"]