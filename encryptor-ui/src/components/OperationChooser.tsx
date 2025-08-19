import './operation-chooser.css'

type Props = {
  onChoose: (mode: 'encrypt' | 'decrypt') => void;
};

function OperationChooser({onChoose} : Props) {
  return (
    <div className="op-chooser">
      <h2>Choose Operation</h2>
      <p>What would you like to do today?</p>
      <button className="op-button" onClick={() => onChoose('encrypt')}>
        <div>🔒</div>
        <div>
          <div>Encrypt text</div>
          <div> Convert plain text to secure cipher</div>
        </div>
      </button>
      <button className="op-button" onClick={() => onChoose('decrypt')}>
        <div>🔒</div>
        <div>
          <div>Decrypt text</div>
          <div>Convert cipher back to plain text</div>
        </div>
      </button>
    </div>
  );
}

export default OperationChooser