import { useState } from "react";
import { encryptText } from "../api";
import { Lock, ArrowLeft, Key, Shield } from 'lucide-react'
import './operation-screen.css'

type Props = { onBack: (mode: 'home') => void };

export default function EncryptScreen({onBack}: Props){

  const [text, setText] = useState("")
  const [key, setKey] = useState("")
  const [cipher, setCipher] = useState("")
  const isValidKey = /^\d{8}$/.test(key);
  const hasText = text.trim().length > 0;
  const canEncrypt = isValidKey && hasText;

  async function handleEncrypt(){
    if(!canEncrypt){
        return;
    }
    setCipher('')
    try{
        const {ciphertext} = await encryptText(text, key)
        setCipher(ciphertext)
    } catch (e){
        alert("error occurred")
    }
  }

  function clear(){
    setText('')
    setKey('')
    setCipher('')
  }

  return(
    <div className="encrypt-decrypt-screen">

        <div className="panel-header">
			<button className="back-button" onClick={() => onBack('home')}>
                <ArrowLeft size={18}/>
            </button>
            <Lock color="rgb(96, 165, 250)" size={18}/>
			<p className="header-title">Text Encryption</p>
        </div>

        <div className="main-section">
            <div className="form-header">
                <p className="panel-title">Encrypt your Message</p>
                <button className="clear-button" onClick={clear}>Clear All</button>
            </div>

            <label className="field-label">
                <Lock size={15}/>
                Text to Encrypt
            </label>
            <textarea className="input1"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the text to encrypt..."
            />

            <label className="field-label">
                <Key size={15}/>
                8-Digit Key
            </label>
            <input className={"input2 " + (isValidKey ? "valid" : "")}
                value={key}
                placeholder="12345678"
                maxLength={8}
                onChange={(e) => setKey(e.target.value)}
            />
            <div className="warning"> <Shield size={12}/> Enter exactly 8 digits</div>

            <button className={"operation-button " + (canEncrypt? "" : "disabled")} onClick={handleEncrypt} disabled={!canEncrypt}>
                <Lock size={20}/>
                Encrypt Text
            </button>

            <hr className="divider"/>

            <div>
                <div className="field-label">
                    <Shield size={15}/>
                    Encrypted Text (Ciphertext)
                </div>
                <textarea className="input3"
                value={cipher}
                onChange={(e) => setCipher(e.target.value)}
                placeholder="Your encrypted text will appear here…"
                readOnly
                />
            </div>
        </div>
    </div>
  )
}