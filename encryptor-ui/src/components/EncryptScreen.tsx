import { useState } from "react";
import { encryptText } from "../api";

type Props = { onBack: (mode: 'home') => void };

export default function EncryptScreen({onBack}: Props){

  const [text, setText] = useState("")
  const [key, setKey] = useState("")
  const [cipher, setCipher] = useState("")
  const isValidKey = /^\d{8}$/.test(key);

  async function handleEncrypt(){
    setCipher('')

    if(!isValidKey){
        return;
    }
    if(!text.trim()){
        return
    }
    try{
        const {ciphertext} = await encryptText(text, key)
        setCipher(ciphertext)
    } catch (e){
        alert("error occurred")
    }
  }

  return(
    <>
        <div className="panel-header">
			<button onClick={() => onBack('home')}>Back</button>
			<h2>Text Encryption</h2>
        </div>
        <div>
            <label className="text-field-description">Text to Encrypt</label>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text to encrypt..."
            />
            <label className="key-field">8-Digit Security Key</label>
            <input 
                value={key}
                placeholder="12345678"
                maxLength={8}
                onChange={(e) => setKey(e.target.value)}
            />
            <div>Enter exactly 8 digits</div>
            <button className="operation-button" onClick={handleEncrypt}>Encrypt Text</button>
            <div className="result">
                <div>Encrypted Text (Ciphertext)</div>
                <textarea
                value={cipher}
                onChange={(e) => setCipher(e.target.value)}
                placeholder="Your encrypted text will appear here…"
                readOnly
                />
            </div>
        </div>
    </>
  )
}