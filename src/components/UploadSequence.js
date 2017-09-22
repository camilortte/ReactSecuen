import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import './global/css/UploadSequence.css';
import ReadFASTAContent from './ReadFile';


class UploadSequence extends Component {

  constructor(props){
    super(props);
    this.state = {
      accepted: [],
      rejected: [],
      sequence1: null,
      sequence2: null
    };

    this.onDrop = this.onDrop.bind(this);
  }

  onLoadSequences(sequence1, sequence2){
    this.props.onLoadSequences(sequence1, sequence2);
  }

  onDrop(accepted, rejected){
    if(accepted !== null && accepted !== undefined){
      this.readTextFile(accepted[0]);
    }
    this.setState({ accepted, rejected });
  }


	readTextFile(file){
		const reader = new FileReader();
    reader.onload = () => {
        const fileAsBinaryString = reader.result;
        // do whatever you want with the file content
        let fastanContent = new ReadFASTAContent(fileAsBinaryString);
        const sequence1 = fastanContent.getSequence1();
        const sequence2 = fastanContent.getSequence2();
        this.setState({sequence1: sequence1, sequence2: sequence2});
        this.onLoadSequences(sequence1, sequence2);
    };
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');

    reader.readAsBinaryString(file);
	};


  render() {

    let acceptedFile = null;
    if(this.state.accepted.length > 0){
      acceptedFile = (
        <aside>
          <h4>Archivo "{this.state.accepted[0].name}" ({this.state.accepted[0].size} bytes) cargado.</h4>
        </aside>
      );
    }

    let resultSequences =  null;
    if(this.state.sequence1 !== null && this.state.sequence2 !== null){
      resultSequences = (
          <aside className="sequences pure-g">
            <div className="pure-u-12-24">
              <div className="sequence-container">
                <h4>{this.state.sequence1.description}</h4>
                <textarea >
                  {this.state.sequence1.payload}
                </textarea>
              </div>
            </div>
            <div className="pure-u-12-24">
              <div className="sequence-container">
                <h4>{this.state.sequence2.description}</h4>
                <textarea>
                  {this.state.sequence2.payload}
                </textarea>
              </div>
            </div>
          </aside>
      );
    }else{
      resultSequences =  null;
    }

    return (
      <section id="App-UploadSequence">
        {acceptedFile}

        <div className="dropzone">
          <Dropzone
            accept=".fasta,.fast,.fa,.txt"
            className="drop-zone"
            acceptClassName="drop-zone-active"
            rejectClassName="drop-zone-reject"
            multiple={false}
            onDrop={this.onDrop}
          >

            <p>Click o arrastrar para cargar una archivo con secuencas.</p>
            <p>Solo son permitidos los archivos *.fasta, *fast o *.txt</p>
          </Dropzone>
        </div>

        {resultSequences}


      </section>
    );
  }
}

export default UploadSequence;
