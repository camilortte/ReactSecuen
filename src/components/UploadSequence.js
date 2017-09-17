import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './global/css/UploadSequence.css';

class UploadSequence extends Component {

  constructor(props){
    super(props);
    this.state = {
      accepted: [],
      rejected: []
    }
  }

  render() {
    return (
      <section id="App-UploadSequence">
        <div className="dropzone">
          <Dropzone
            accept=".fasta,.fast,.fa,.txt"
            className="drop-zone"
            acceptClassName="drop-zone-active"
            rejectClassName="drop-zone-reject"
            multiple={false}
            onDrop={(accepted, rejected) => { this.setState({ accepted, rejected }); }}
          >
            <p>Click o arrastrar para cargar una archivo con secuencas.</p>
            <p>Solo son permitidos los archivos *.fasta, *fast o *.txt</p>
          </Dropzone>
        </div>
        <aside>
          <h2>Accepted files</h2>
          <ul>
            {
              this.state.accepted.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
            }
          </ul>
        </aside>
      </section>
    );
  }
}

export default UploadSequence;
