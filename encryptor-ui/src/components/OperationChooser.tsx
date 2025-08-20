import './operation-chooser.css'
import { Lock, LockOpen} from 'lucide-react'

type Props = {
  onChoose: (mode: 'encrypt' | 'decrypt') => void;
};

function OperationChooser({onChoose} : Props) {
  return (
    <div className="op-chooser">
      <p className="op-prompt">Choose Operation</p>
      <button className="op-button" onClick={() => onChoose('encrypt')}>
        <div className="button-container">
          <Lock className="lock1"/>
          <div className="button-txt">
            <div>Encrypt text</div>
            <div> Convert plain text to secure cipher</div>
          </div>
        </div>
      </button>
      <button className="op-button" onClick={() => onChoose('decrypt')}>
        <div className="button-container">
          <LockOpen className="lock1"/>
          <div className="button-txt">
            <div>Decrypt text</div>
            <div>Convert cipher back to plain text</div>
          </div>
        </div>
      </button>
    </div>
  );
}

export default OperationChooser