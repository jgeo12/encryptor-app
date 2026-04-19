# Encryptor App

Project implementing a Blowfish-based encryptor inspired by the original paper, with a small simplification in my implementation.

Live app: **https://jg-encryptor.vercel.app/**

For detailed information on the Blowfish encryption algorithm, see the original paper:
https://groups.csail.mit.edu/cag/pub/dm/papers/schneier:blowfish.html

## Encryption / Decryption Flow

| Encryption | Decryption |
| --- | --- |
| `1.` Plaintext input | `1.` Ciphertext input |
| `2.` Split into 8-character chunks | `2.` Split ciphertext into 96-bit blocks |
| `3.` Convert each chunk to binary | `3.` Split each 96-bit block into 64-bit ciphertext + 32-bit padding length |
| `4.` Pad the final chunk to 64 bits if needed | `4.` Apply Blowfish-based block decryption |
| `5.` Apply Blowfish-based block encryption | `5.` Remove padding using the stored padding length |
| `6.` Append 32-bit padding length | `6.` Convert binary back to text |
| `7.` Concatenate encrypted 96-bit blocks | `7.` Concatenate decrypted chunks |
| `8.` Ciphertext output | `8.` Plaintext restored |

## Repository layout

- `backend/` — Blowfish implementation in OCaml.
  - `bin/main.ml` — Top level which exposes the backend.
  - `lib/` — Blowfish implementation code.
  - `data/` — Files of constants used by the Blowfish algorithm.
  - `test/` — OCaml test cases.
- `encryptor-ui/` — React frontend.
  - `src/` — React component code.
