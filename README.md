# Encryptor App

Project implementing a Blowfish-based encryptor inspired by the original paper, with a small simplification in my implementation.

For detailed information on the Blowfish encryption algorithm, see the original paper:
https://groups.csail.mit.edu/cag/pub/dm/papers/schneier:blowfish.html

## Encryption / Decryption Flow

```mermaid
flowchart TD
    subgraph ENC[Encryption]
        A[Plaintext input] --> B[Split into 8-character chunks]
        B --> C[Convert each chunk to 64-bit binary]
        C --> D[Pad final chunk to 64 bits if needed]
        D --> E[Apply Blowfish-based block encryption with 8-digit key]
        E --> F[Append 32-bit padding length]
        F --> G[Concatenate encrypted 96-bit blocks]
    end

    G --> H[Ciphertext output]

    subgraph DEC[Decryption]
        H --> I[Split ciphertext into 96-bit blocks]
        I --> J[Split each block into 64-bit ciphertext + last 32-bit padding length]
        J --> K[Apply Blowfish-based block decryption with same 8-digit key]
        K --> L[Remove padding using the stored padding length]
        L --> M[Convert binary back to text]
        M --> N[Concatenate decrypted chunks]
        N --> O[Plaintext restored]
    end

    classDef enc fill:#dff4ff,stroke:#2563eb,stroke-width:1.5px,color:#0f172a;
    classDef dec fill:#e7f8e8,stroke:#2f855a,stroke-width:1.5px,color:#0f172a;
    classDef boundary fill:#f8fafc,stroke:#94a3b8,stroke-width:1px,color:#0f172a;

    class A,B,C,D,E,F,G enc;
    class H boundary;
    class I,J,K,L,M,N,O dec;
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
