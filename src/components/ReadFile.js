export default class ReadFASTAContent  {

  constructor(content){
    this.content = content;
    this.sequence1 = {
      description: null,
      payload: ""
    };
    this.sequence2 = {
      description: null,
      payload: ""
    };
    this.readSequences();
  }

  readSequences(){
    let lines = this.content.split('\n');
    let error = false;
    let read_first_sequence = true;
    for(let i = 0;i < lines.length;i++){
      if (lines[i].indexOf('>') >= 0){
        if(this.sequence1.description === null){
          // Save the description of first sequence
          read_first_sequence = true;
          this.sequence1.description = lines[i].substr(1);
        }else if(this.sequence2.description === null){
          // Save the description of second sequence
          read_first_sequence = false;
          this.sequence2.description = lines[i].substr(1);
        }else{
          // An error occured
          error = true;
          break;
        }
      }else{
        if(read_first_sequence){
          // Save the payload of first sequence
          this.sequence1.payload += lines[i];
        }else{
          // Save the payload of second sequence
          this.sequence2.payload += lines[i];
        }
      }
    }

    if(error){
      this.sequence1.payload = null;
      this.sequence2.payload = null;
    }
  }


  getSequence1(){
    return this.sequence1;
  }

  getSequence2(){
    return this.sequence2;
  }
}
