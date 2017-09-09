import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import NeedlemanWunschAlgorithm from './components/AlgoritmoNeedlemanWunsch/NeedlemanWunsch'



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
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          P{this.state.alignment1}A
        </p>
        <p>
          {this.state.alignment2}
        </p>
      </div>
    );
  }
}

export default App;
