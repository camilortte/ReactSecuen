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

        <div class="pure-g">
            <div class="pure-u-6-12">
              <textarea rows="4" cols="50">
                {this.state.alignment1}
              </textarea>
            </div>
            <div class="pure-u-6-12">
              <textarea rows="4" cols="50">
                {this.state.alignment1}
              </textarea>
            </div>

        </div>

        <p className="App-intro">
          {this.state.alignment1}
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
