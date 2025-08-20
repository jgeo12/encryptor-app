import { useState } from "react";
import { decryptText } from "../api";
import { LockOpen, ArrowLeft, Key, Shield} from 'lucide-react'

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
			<div>
                <p>Decrypt your Message</p>
                <button onClick={clear}>Clear All</button>
            </div>
        	<div className="main-section">
            	<label className="text-field-description">Text to Decrypt</label>
            	<textarea
                	value={cipher}
                	onChange={(e) => setCipher(e.target.value)}
                	placeholder="Enter the text to decrypt..."
            	/>
            	<label className="key-field">8-Digit Security Key</label>
            	<input 
                	value={key}
                	placeholder="12345678"
                	maxLength={8}
                	onChange={(e) => setKey(e.target.value)}
            	/>
            	<div>Enter exactly 8 digits</div>
            	<button className="operation-button" onClick={handleDecrypt}>Decrypt Text</button>
            	<div className="result">
                	<div>Decrypted Text (Original)</div>
                	<textarea
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