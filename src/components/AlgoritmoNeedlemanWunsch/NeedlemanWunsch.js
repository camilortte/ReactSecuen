export default class NeedlemanWunschAlgorithm  {

  constructor(sequence1, sequence2){
    this.DEBUG = false;

    const GAP = -5;
    const cost_matrix = [
        [10, -1, -3, -4],
        [-1, 7, -5, -3],
        [-3, -5, 9, 0],
        [-4, -3, 0, 8]
    ];

    this.sequence1 = sequence1;
    this.sequence2 = sequence2;

    this.alignment1 = "";
    this.alignment2 = "";

    this.GAP = GAP;
    this.cost_matrix = cost_matrix;

    this.way_matrix = {};

    // Generate Matrix of sequence1 x sequence2
    this.matrix_value = new Array(this.sequence2.length);
    for (let i = 0; i < this.sequence2.length + 1; i++) {
      this.matrix_value[i] = new Array(this.sequence1.length + 1);
    }
  }

  // Return the cost for values a, b String
  getCost(a, b){
    return this.cost_matrix[this.getIntValues(a)][this.getIntValues(b)];
  }

  // Return the mapping int for char values
  getIntValues(character){
    if(character === 'A'){
      return 0;
    }else if (character === 'G'){
      return 1;
    }else if (character === 'C'){
      return 2;
    }else if (character === 'T'){
      return 3;
    }
    return null
  }


  // Fill cost_matrix with values
  fillValueMatrix(){
    for(let i=0;i<this.sequence2.length + 1; i++) {
      this.matrix_value[i][0] = this.GAP * i;
    }

    for(let j=0;j<this.sequence1.length + 1; j++) {
      this.matrix_value[0][j] = this.GAP * j;
    }

    for(let i=1;i<this.sequence2.length + 1; i++) {
      for(let j=1;j<this.sequence1.length + 1; j++) {
        // calc for diagonal
        const value_match = this.matrix_value[i-1][j-1] + this.getCost(this.sequence2[i-1], this.sequence1[j-1]);
        // Calc for right
        const value_insert = this.matrix_value[i][j-1] + this.GAP;

        // calc  left
        const value_delete = this.matrix_value[i-1][j] + this.GAP;

        //get max
        this.matrix_value[i][j] = Math.max(value_match, value_delete, value_insert);
      }
    }
  }

  // Align the sequences, return an array with result
  makeAlignment(){
    let i = this.sequence2.length;
    let j = this.sequence1.length;

    this.way_matrix[(i).toString() + "," + (j).toString()] = [i, j];
    while(i > 0 || j > 0){
      const cost = this.getCost(this.sequence1[j-1], this.sequence2[i-1]);
      if(this.DEBUG){
        console.group("Align result for (", i, ", ", j, "):");
        console.log(this.sequence1, this.sequence2);
        console.log(i, ", ", j);
        console.log("Matrix position", this.matrix_value[i][j]);
        try{
          console.log("Diagonal", this.matrix_value[i-1][j-1]);
        }catch (e){}
        try{
          console.log("Up", this.matrix_value[i-1][j]);
        }catch (e){}
        try{
          console.log("Left", this.matrix_value[i][j-1]);
        }catch (e){}
        console.log("Cost: ", cost);
      }

      // Check diagonal
      if(i > 0 && j > 0 && this.matrix_value[i][j] === this.matrix_value[i-1][j-1] + cost){
        // ((this.DEBUG === true) ? console.log("Select diagonal") : null);
        this.alignment1 = this.sequence1[j-1] + this.alignment1;
        this.alignment2 = this.sequence2[i-1] + this.alignment2;
        this.way_matrix[(i-1).toString() + "," + (j-1).toString()] = [i-1, j-1];
        i -= 1;
        j -= 1;
      }

      // Check left
      else if(j > 0 && this.matrix_value[i][j] === this.matrix_value[i][j-1] + this.GAP){
        // ((this.DEBUG === true) ? console.log("Select left") : null);
        this.alignment2 = "-" + this.alignment2;
        this.alignment1 = this.sequence1[j-1] + this.alignment1;
        this.way_matrix[(i).toString() + "," + (j-1).toString()] = [i, j-1];
        j -= 1;
      }

      // Check right
      else {
        // ((this.DEBUG === true) ? console.log("Select right") : null);
        this.alignment2 = this.sequence2[i-1] + this.alignment2;
        this.alignment1 = "-" + this.alignment1;
        this.way_matrix[(i-1).toString() + "," + (j).toString()] = [i-1, j];
        i -= 1;
      }

      if(this.DEBUG){
        console.groupEnd();
      }
    }

    if(this.DEBUG){
      this.printAlignment();
    }

    return [this.alignment1, this.alignment2];
  }

  printValuematrix(){
    console.table(this.matrix_value);
    // console.log(this.matrix_value);
  }

  printAlignment(){
    console.log("Align1: ", this.alignment1);
    console.log("Align2: ", this.alignment2);
  }


}
