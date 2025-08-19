const API_BASE = "http://localhost:8080"

export async function encryptText(text : string, key: string){
    const res = await fetch(API_BASE + "/api/encrypt-text",{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text, key })
    });
    return (await res.json() as { ciphertext: string});
}

export async function decryptText(ciphertext : string, key: string){
    const res = await fetch(API_BASE + "/api/decrypt-text",{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ciphertext, key })
    });
    return (await res.json() as {text : string});
}
