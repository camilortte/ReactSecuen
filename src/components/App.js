import React, { Component } from 'react';
import './global/css/App.css';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'
import Header from './global/Header'
import UploadSequence from './UploadSequence'
import AlignSequence from './AlignSequence'
// import ScrollSync from "./ScrollSync";

class App extends Component {

  constructor(props){
    super(props);
    // let needlemanWunsch = new NeedlemanWunschAlgorithm(
    //     "AGTTTTTGCTGTTTCGTTTGTCTTTGCTTTTCTTGTTTAAAATCGTACGTGTCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTACCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTAC",
    //     "GGGGGGGAGTTTGCCTTTGCTTTTCTTGTTTAAAATCGTACGTGTCGACCTACCCGGGGTTTTTTGGTTTTCGTAGTTTGGGCCCGTGTACGTGGGCCTTAACGTTACTTTTTTCACCCTACCCGGTTTTCGTATCCCCTCGCGTTTGGGCCATGGTACGTGGGCCTTAACGTTAC"
    // );
    // needlemanWunsch.fillValueMatrix();
    // let resultAlignment = needlemanWunsch.makeAlignment();
    // needlemanWunsch.printValuematrix();
    //
    // needlemanWunsch.printAlignment();
    // console.log(resultAlignment);
    // console.log(resultAlignment[0]);
    this.state = {
      sequence1: null,
      sequence2: null,
      // alignment1: resultAlignment[0],
      // alignment2: resultAlignment[1]
      alignment1: null,
      alignment2: null
    };

    this.onLoadSequences = this.onLoadSequences.bind(this);
  }

  onLoadSequences(sequence1, sequence2){
    const sequence1_data = sequence1.payload;
    const sequence2_data = sequence2.payload;
    this.setState({
     sequence1:sequence1_data,
     sequence2: sequence2_data}
    );
  }

  render() {
    return (
      <div className="App">
        <Header/>
        <UploadSequence onLoadSequences={this.onLoadSequences}/>
        <AlignSequence sequence1={this.state.sequence1} sequence2={this.state.sequence2}/>

      </div>
    );
  }
}

export default App;
