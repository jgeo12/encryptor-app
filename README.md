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

## Hosted Application
The app is deployed and available at: **https://jg-encryptor.vercel.app/**