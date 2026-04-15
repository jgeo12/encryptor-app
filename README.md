# Encryptor App

Project implementing a Blowfish-based encryptor inspired by the original paper, with a small simplification in my implementation.

For detailed information on the Blowfish encryption algorithm, see the original paper:
https://groups.csail.mit.edu/cag/pub/dm/papers/schneier:blowfish.html

## Encryption / Decryption Flow

```mermaid
flowchart LR
    subgraph ENC[Encryption]
        direction TB
        A[Plaintext input] --> B[Split into 8-character chunks]
        B --> C[Convert each chunk to binary]
        C --> D[Pad final chunk to 64 bits if needed]
        D --> E[Apply Blowfish-based block encryption]
        E --> F[Append 32-bit padding length]
        F --> G[Concatenate encrypted 96-bit blocks]
        G --> H[Ciphertext output]
    end

    subgraph DEC[Decryption]
        direction TB
        I[Ciphertext input] --> J[Split ciphertext into 96-bit blocks]
        J --> K[Split each 96-bit block into 64-bit ciphertext + 32-bit padding length]
        K --> L[Apply Blowfish-based block decryption]
        L --> M[Remove padding using stored padding length]
        M --> N[Convert binary back to text]
        N --> O[Concatenate decrypted chunks]
        O --> P[Plaintext restored]
    end

    classDef enc fill:#e0f2fe,stroke:#2563eb,stroke-width:1px,color:#0f172a;
    classDef dec fill:#ecfdf5,stroke:#16a34a,stroke-width:1px,color:#0f172a;
    class A,B,C,D,E,F,G,H enc;
    class I,J,K,L,M,N,O,P dec;
```

## Repository layout

- `backend/` — Blowfish implementation in OCaml.
  - `bin/main.ml` — Top level which exposes the backend.
  - `lib/` — Blowfish implementation code.
  - `data/` — Files of constants used by the Blowfish algorithm.
  - `test/` — OCaml test cases.
- `encryptor-ui/` — React frontend in TypeScript.
  - `src/` — React component code.

## Hosted Application
Live app: **https://jg-encryptor.vercel.app/**
