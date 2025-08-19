import { useState } from 'react'
import './App.css'
import OperationChooser from './components/OperationChooser'
import EncryptScreen from './components/EncryptScreen'
import DecryptScreen from './components/DecryptScreen'

type View = 'home' | 'encrypt' | 'decrypt'

function App() {
  const [view, setView] = useState<View>('home')

  return (
    <div className="app">
      <header className="app-header">
        <div>Blowfish Encryptor</div>
        <div>Secure text encryption and decryption using an 8-digit key and the Blowfish algorithm.</div>
      </header>

      <main>
        {view === 'home' && <OperationChooser onChoose={setView} />}
        {view === 'encrypt' && <EncryptScreen onBack={setView}/>}
        {view === 'decrypt' && <DecryptScreen onBack={setView}/>}
      </main>
    </div>
  )
}

export default App