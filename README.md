# Encryptor App

Project implementing a Blowfish-based (encryption algorithm) encryptor with an OCaml backend and a React frontend.

## Repository layout

- `backend/` — Blowfish implementation in OCaml.
  - `bin/main.ml` — Top level which exposes the backend.
  - `lib/` — Blowfish implementation code.
  - `data/` — Files of constants used by the Blowfish algorithm.
  - `test/` — OCaml test cases.
- `encryptor-ui/` — React frontend in TypeScript.
  - `src/` — React component code.

## Quick start (2-step)

1) Start the backend HTTP server which exposes encryption and decryption endpoints.
2) Start the frontend which calls the backend API.

### 1) Start the backend server

From the repository root, run:

```bash
cd backend
dune build
dune exec bin/main.exe
```

### 2) Start the frontend

From the repository root, run:

```bash
cd encryptor-ui
npm install
npm run dev
```


