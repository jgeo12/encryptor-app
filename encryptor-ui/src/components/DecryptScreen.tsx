import { useState } from "react";
import { decryptText } from "../api";

type Props = { onBack: (mode: 'home') => void };

export default function DecryptScreen({onBack}: Props){

	const [cipher, setCipher] = useState("")
	const [key, setKey] = useState("")
  	const [text, setText] = useState("")
	const isValidKey = /^\d{8}$/.test(key);

	async function handleDecrypt(){
		setCipher('')
	
		if(!isValidKey){
			return;
		}
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

  	return(
    	<>
        	<div className="panel-header">
				<button onClick={() => onBack('home')}>Back</button>
				<h2>Text Decryption</h2>
        	</div>
        	<div>
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
    	</>
  	)
}