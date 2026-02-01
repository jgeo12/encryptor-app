FROM ocaml/opam:debian-12-ocaml-5.1

WORKDIR /app
COPY . .

RUN sudo apt-get update && sudo apt-get install -y --no-install-recommends \
	gcc \
	make \
	libc6-dev \
	libev-dev \
	libgmp-dev \
	libssl-dev \
	pkg-config \
 && sudo rm -rf /var/lib/apt/lists/*

RUN sudo chown -R opam:opam /app
USER opam

RUN opam update \
 && opam install -y dune batteries dream yojson lwt csv ounit2 bisect_ppx

RUN cd backend && opam exec -- dune build bin/main.exe \
 && ls -la _build/default/bin/main.exe

CMD ["bash", "-lc", "echo RUNNING PORT=$PORT; opam exec -- ./backend/_build/default/bin/main.exe; echo EXIT_CODE=$?"]
