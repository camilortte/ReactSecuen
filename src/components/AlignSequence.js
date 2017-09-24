import React, { Component } from 'react';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'; // only needs to be imported once
import "./global/css/example.css";
import scrollbarSize from "dom-helpers/util/scrollbarSize";
import cn from "classnames";


const LEFT_COLOR_FROM = "#61dafb";
const LEFT_COLOR_TO = "#BC3959";
const TOP_COLOR_FROM = "#000000";
const TOP_COLOR_TO = "#333333";


/**
 * Ported from sass implementation in C
 * https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
 */
function mixColors(color1, color2, amount) {
  const weight1 = amount;
  const weight2 = 1 - amount;

  const r = Math.round(weight1 * color1.r + weight2 * color2.r);
  const g = Math.round(weight1 * color1.g + weight2 * color2.g);
  const b = Math.round(weight1 * color1.b + weight2 * color2.b);

  return { r, g, b };
}

class AlignSequence extends Component {

  constructor(props){
    super(props);
    this.state = {
      sequence1: props.sequence1,
      sequence2: props.sequence2,
      sequence1Array: [],
      sequence2Array: [],
      alignment1: null,
      alignment2: null,
      alignment1Array:[],
      alignment2Array:[],
      valueMatrix: null,
      wayMatrix:null,
      loadingAlgorithm: false,

      columnWidth: 50,
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 50,
      rowCount: 100,

      isHoveredButtonAlign: false
    };

    this.align = this.align.bind(this);
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderHeaderCell = this._renderHeaderCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
    this._renderLeftHeaderCell = this._renderLeftHeaderCell.bind(this);
    this._onClickAlignSequenceButton = this._onClickAlignSequenceButton.bind(this);
    this.renderButtonAlign = this.renderButtonAlign.bind(this);
    this.renderAlignmentTable = this.renderAlignmentTable.bind(this);
    this._renderAlignmentTableCell = this._renderAlignmentTableCell.bind(this);
  }

  // Usage the Algorith of needlemanWunsch to aligment sequence1 with sequence2
  align(sequence1, sequence2){
    if(sequence1!==null && sequence1!==undefined &&
        sequence2 !== null && sequence2!==undefined){
      let needlemanWunsch = new NeedlemanWunschAlgorithm(
        sequence1,
        sequence2
      );
      needlemanWunsch.fillValueMatrix();
      let resultAlignment = needlemanWunsch.makeAlignment();

      let alignment1Array = resultAlignment[0].split("");
      let alignment2Array = resultAlignment[1].split("");

      this.setState({
        alignment1: resultAlignment[0],
        alignment2: resultAlignment[1],
        valueMatrix: needlemanWunsch.matrix_value,
        wayMatrix: needlemanWunsch.way_matrix,
        rowCount: needlemanWunsch.matrix_value.length,
        columnCount: needlemanWunsch.matrix_value[0].length + 1,
        alignment1Array: alignment1Array,
        alignment2Array: alignment2Array,
        loadingAlgorithm: false
      });
    }
  }

  _onClickAlignSequenceButton(){
    if(this.state.alignment1 === null && this.state.alignment2 === null){
      // var self = this;
      this.setState({loadingAlgorithm: true}, () => {
        console.log(this.state.loadingAlgorithm);
        setTimeout (() => {
          this.align(this.state.sequence1, this.state.sequence2)
        }, 500);

      });
    }
  }

  render() {
    console.log("Calling render");
    let valueMatrixTable = null;
    let renderButtonAlignData = null;
    let renderAlignmentTableData = null;
    if(this.state.valueMatrix){
      valueMatrixTable = this.renderTableValues();
    }
    if(this.state.sequence1 && this.state.sequence2 && !this.state.alignment1){
      renderButtonAlignData = this.renderButtonAlign();
    }
    if(this.state.alignment1 && this.state.alignment2){
      renderAlignmentTableData = this.renderAlignmentTable();
    }

    return (
      <div className="App-Align-sequence pure-g">
        <h1>{this.state.loadingAlgorithm}</h1>
        {renderButtonAlignData}
        {valueMatrixTable}
        {renderAlignmentTableData}
      </div>
    );
  }

  renderButtonAlign(){
    console.log("Rendering button align");
    let btnAlignClass = "animated infinite pulse";
    let btnString = "Alinear secuencias";
    if(this.state.loadingAlgorithm){
      console.log("Rendering button align en true");
      btnString = "loading...";
      btnAlignClass = "animated infinite jello";
    }
    return(
      <aside className="pure-u-24-24 action-align">
        <button className={"pure-button pure-button-primary " + btnAlignClass}
              onClick={this._onClickAlignSequenceButton}>{btnString}</button>
      </aside>
    );
  }

  _renderAlignmentTableCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    let color = "red";
    if(this.state.alignment1Array[columnIndex-1] === this.state.alignment2Array[columnIndex-1]){
      color = "green";
    }
    style.backgroundColor = color;
    style.left = style.left - this.state.rowHeight;
    if(rowIndex === 0){

      return (
        <div className={"headerCell"} key={key} style={style}>
          {this.state.alignment1Array[columnIndex-1]}
        </div>
      );
    }else{
      return (
        <div className={"headerCell"} key={key} style={style}>
          {this.state.alignment2Array[columnIndex-1]}
        </div>
      );
    }

  }

  renderAlignmentTable(){
    const {
      alignment1Array,
      columnWidth,
      rowHeight,
      overscanColumnCount,
      overscanRowCount
    } = this.state;

    return(
      <div className="pure-u-24-24">
        <h2 className="text-center">Resultado alineación</h2>
        <div className={"GridColumn"}>
          <AutoSizer disableHeight>
            {({ width }) =>
              <div>
                  <Grid
                    overscanColumnCount={overscanColumnCount}
                    overscanRowCount={overscanRowCount}
                    className={"AlignmentGrid"}
                    columnWidth={columnWidth}
                    columnCount={alignment1Array.length + 1}
                    height={rowHeight * 2}
                    cellRenderer={this._renderAlignmentTableCell}
                    rowHeight={rowHeight}
                    rowCount={2}
                    width={width}
                  />
              </div>}
          </AutoSizer>
        </div>
        <br/><br/><br/>
      </div>
    );
  }

  renderTableValues(){
    const {
      columnCount,
      columnWidth,
      height,
      overscanColumnCount,
      overscanRowCount,
      rowHeight,
      rowCount
    } = this.state;
    return(
        <div className="pure-u-24-24">
          <ScrollSync>
            {({
              clientHeight,
              clientWidth,
              onScroll,
              scrollHeight,
              scrollLeft,
              scrollTop,
              scrollWidth
            }) => {
              const x = scrollLeft / (scrollWidth - clientWidth);
              const y = scrollTop / (scrollHeight - clientHeight);

              const leftBackgroundColor = mixColors(
                LEFT_COLOR_FROM,
                LEFT_COLOR_TO,
                y
              );
              const leftColor = "#ffffff";
              const topBackgroundColor = mixColors(
                TOP_COLOR_FROM,
                TOP_COLOR_TO,
                x
              );
              const topColor = "#fff";
              const middleBackgroundColor = mixColors(
                leftBackgroundColor,
                topBackgroundColor,
                0.5
              );
              const middleColor = "#ffffff";

              return (

                <div className={"GridRow"} >
                  <div
                    className={ "LeftSideGridContainer"}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      color: leftColor,
                      backgroundColor: "#61dafb"
                    }}
                  >
                    <Grid
                      cellRenderer={this._renderLeftHeaderCell}
                      className={"HeaderGrid"}
                      width={columnWidth}
                      height={rowHeight}
                      rowHeight={rowHeight}
                      columnWidth={columnWidth}
                      rowCount={1}
                      columnCount={1}
                    />
                  </div>
                  <div
                    className={"LeftSideGridContainer"}
                    style={{
                      position: "absolute",
                      left: 0,
                      top: rowHeight,
                      color: leftColor,
                      backgroundColor: "#61dafb"
                    }}
                  >
                    <Grid
                      overscanColumnCount={overscanColumnCount}
                      overscanRowCount={overscanRowCount}
                      cellRenderer={this._renderLeftSideCell}
                      columnWidth={columnWidth}
                      columnCount={1}
                      className={"LeftSideGrid"}
                      height={height - scrollbarSize()}
                      rowHeight={rowHeight}
                      rowCount={rowCount}
                      scrollTop={scrollTop}
                      width={columnWidth}
                    />
                  </div>
                  <div className={"GridColumn"}>
                    <AutoSizer disableHeight>
                      {({ width }) =>
                        <div>
                          <div
                            style={{
                              backgroundColor: '#61dafb',
                              color: topColor,
                              height: rowHeight,
                              width: width - scrollbarSize()
                            }}
                          >
                            <Grid
                              className={"HeaderGrid"}
                              columnWidth={columnWidth}
                              columnCount={columnCount}
                              height={rowHeight}
                              overscanColumnCount={overscanColumnCount}
                              cellRenderer={this._renderHeaderCell}
                              rowHeight={rowHeight}
                              rowCount={1}
                              scrollLeft={scrollLeft}
                              width={width - scrollbarSize()}
                            />
                          </div>
                          <div
                            style={{
                              color: "#57c4e1",
                              height,
                              width: width
                            }}
                          >
                            <Grid
                              className={"BodyGrid"}
                              columnWidth={columnWidth}
                              columnCount={columnCount}
                              height={height}
                              onScroll={onScroll}
                              overscanColumnCount={overscanColumnCount}
                              overscanRowCount={overscanRowCount}
                              cellRenderer={this._renderBodyCell}
                              rowHeight={rowHeight}
                              rowCount={rowCount}
                              width={width}
                            />
                          </div>
                        </div>}
                    </AutoSizer>
                  </div>
                </div>
              );
            }}
          </ScrollSync>
        </div>
    )
  }

  _renderBodyCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    let classNames = "headerCell";
    if(this.state.wayMatrix){
      if(this.state.wayMatrix[rowIndex.toString()+","+ (columnIndex - 1).toString()] !== undefined){
        // classNames = cn("oddRow", "cell");
        style.backgroundColor = "red";
      }
    }

    return (
      <div className={classNames} key={key} style={style}>
        {this.state.valueMatrix[rowIndex][columnIndex-1]}
      </div>
    );
  }

  _renderHeaderCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    const rowClass = columnIndex % 2 === 0  ? "oddRow" : "evenRow";
    const classNames = cn(rowClass, "cell");

    return (
      <div className={classNames} key={key} style={style}>
        {this.state.sequence1Array[columnIndex]}
      </div>
    );
  }

  _renderLeftHeaderCell({ columnIndex, key, style }) {
    const rowClass = columnIndex % 2 === 0  ? "oddRow" : "evenRow";
    const classNames = cn(rowClass, "cell");

    return (
      <div className={classNames} key={key} style={style}>
        {this.state.sequence1Array[columnIndex]}
      </div>
    );
  }

  _renderLeftSideCell({ columnIndex, key, rowIndex, style }) {
    const rowClass =
      rowIndex % 2 === 0
        ? columnIndex % 2 === 0 ? "evenRow" : "oddRow"
        : columnIndex % 2 !== 0 ? "evenRow" : "oddRow";
    const classNames = cn(rowClass, "cell");

    return (
      <div className={classNames} key={key} style={style}>
        {this.state.sequence2Array[rowIndex]}
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(this.props !== nextProps) {
      let sequence1Array = nextProps.sequence1.split("");
      sequence1Array.unshift("", "");
      let sequence2Array = nextProps.sequence2.split("");
      sequence2Array.unshift("");
      this.setState({
        sequence1: nextProps.sequence1,
        sequence2: nextProps.sequence2,
        sequence1Array: sequence1Array,
        sequence2Array: sequence2Array,
        alignment1: null,
        alignment2: null,
        valueMatrix: null
      });
    }
  }
}

export default AlignSequence;
