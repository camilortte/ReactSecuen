import React, { Component } from 'react';
import './global/css/App.css';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'
import Header from './global/Header'
import UploadSequence from './UploadSequence'

class App extends Component {

  constructor(props){
    super(props);
    let needlemanWunsch = new NeedlemanWunschAlgorithm(
        "AGTTTTTGCTGTTTCGTTTGTCTTTGCTTTTCTTGTTTAAAATCGTACGTGTCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTACCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTAC",
        "GGGGGGGAGTTTGCCTTTGCTTTTCTTGTTTAAAATCGTACGTGTCGACCTACCCGGGGTTTTTTGGTTTTCGTAGTTTGGGCCCGTGTACGTGGGCCTTAACGTTACTTTTTTCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTAC"
    );
    needlemanWunsch.fillValueMatrix();
    let resultAlignment = needlemanWunsch.makeAlignment();
    needlemanWunsch.printAlignment();
    console.log(resultAlignment);
    console.log(resultAlignment[0]);
    this.state = {
      alignment1: resultAlignment[0],
      alignment2: resultAlignment[1],
      nimierda: "Nimierda"
    }
  }


  render() {
    return (
      <div className="App">
        <Header/>
        <UploadSequence/>

        <p className="App-intro">
          P{this.state.alignment1}A
        </p>
        <p>
          {this.state.alignment2}
        </p>
        <div>

        </div>
      </div>
    );
  }
}

export default App;
