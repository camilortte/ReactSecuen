import React, { Component } from 'react';
import './global/css/App.css';
import Header from './global/Header'
import UploadSequence from './UploadSequence'
import AlignSequence from './AlignSequence'
import Footer from "./global/Footer"

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      sequence1: null,
      sequence2: null,
      alignment1: null,
      alignment2: null
    };

    this.onLoadSequences = this.onLoadSequences.bind(this);
  }
  // When the sequences are load
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
        <div className="content">
          <Header/>
          <UploadSequence onLoadSequences={this.onLoadSequences}/>
          <AlignSequence sequence1={this.state.sequence1} sequence2={this.state.sequence2}/>
        </div>
        <Footer/>
      </div>
    );
  }
}

export default App;
