import React, { Component } from 'react';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'

class AlignSequence extends Component {

  constructor(props){
    super(props);
    this.state = {
      sequence1: props.sequence1,
      sequence2: props.sequence2
    };
    this.align();
  }

  align(sequence1, sequence2){
    console.log("Align method" , this.state.sequence1);
    if(sequence1!==null && sequence1!==undefined &&
        sequence2 !== null && sequence2!==undefined){
      console.log("Align method2" , "_" + sequence1 + "_", "_" + sequence2 + "_");
      sequence1 = sequence1.replace("\n","");
      sequence1 = sequence1.replace(" ","");

      sequence2 = sequence2.replace("\n","");
      sequence2 = sequence2.replace(" ","");
      let needlemanWunsch = new NeedlemanWunschAlgorithm(
        sequence1,
        sequence2
      );
      needlemanWunsch.fillValueMatrix();
      let resultAlignment = needlemanWunsch.makeAlignment();
      console.log(resultAlignment);
      console.log(resultAlignment[0]);
    }

  }

  render() {
    return (
      <div className="App-Align-sequence">
        <h1>{this.state.sequence1}</h1>
        <h1>{this.state.sequence2}</h1>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps) {
      this.setState({
        sequence1: nextProps.sequence1,
        sequence2: nextProps.sequence2
      });
      this.align(nextProps.sequence1, nextProps.sequence2);
    }
  }
}

export default AlignSequence;
