import { useState } from "react";
import { decryptText } from "../api";
import { LockOpen, ArrowLeft, Key, Shield, CircleCheckBig } from 'lucide-react'
import './operation-screen.css'

type Props = { onBack: (mode: 'home') => void };

export default function DecryptScreen({onBack}: Props){

	const [cipher, setCipher] = useState("")
	const [key, setKey] = useState("")
  	const [text, setText] = useState("")
	const isValidKey = /^\d{8}$/.test(key);
	const hasCipher = cipher.trim().length > 0;
	const canDecrypt = isValidKey && hasCipher;

	async function handleDecrypt(){
		if(!isValidKey){
			return;
		}
		setText('')
		if(!cipher.trim()){
			return
		}
		try{
			const {text} = await decryptText(cipher, key)
			setText(text)
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
            	<LockOpen color="rgb(96, 165, 250)" size={18}/>
				<p className="header-title">Text Decryption</p>
        	</div>

        	<div className="main-section">
				<div className="form-header">
                	<p className="panel-title">Decrypt your Message</p>
                	<button className="clear-button" onClick={clear}>Clear All</button>
            	</div>

            	<label className="field-label">
					<Shield size={15}/>
					Ciphertext to Decrypt
				</label>
            	<textarea className="input1"
                	value={cipher}
                	onChange={(e) => setCipher(e.target.value)}
                	placeholder="Enter the text to decrypt..."
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

				<button className={"operation-button " + (canDecrypt? "" : "disabled")} onClick={handleDecrypt} disabled={!canDecrypt}>
                	<LockOpen size={20}/>
                	Decrypt Text
            	</button>

				<hr className="divider"/>

            	<div>
                	<div className="field-label">
						<CircleCheckBig size={15}/>
						Decrypted Text (Original)
					</div>
                	<textarea className="input3"
                		value={text}
                		onChange={(e) => setText(e.target.value)}
                		placeholder="Your decrypted text will appear here…"
                		readOnly
                	/>
            	</div>
        	</div>
    	</div>
  	)
}