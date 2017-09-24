import React, { Component } from 'react';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized'
// import 'react-virtualized/styles.css'; // only needs to be imported once
import "./global/css/AlignSequence.css";
import scrollbarSize from "dom-helpers/util/scrollbarSize";
import cn from "classnames";


const RED_COLOR = "#ff7c03";
const GREEN_COLOR = "green";
const TEXT_COLOR_HEACER_CELL = "#fff";
const BACKGROUND_HEADER_COLOR = "#61dafb";
const TEXT_COLOR_BODY_CELL = "#57c4e1";


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
      showMatrixValue: false,

      columnWidth: 50,
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 50,
      rowCount: 100
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

  // Usage the Algorithm of needlemanWunsch to alignment sequence1 with sequence2
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

  // When on click on the Button
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
        {renderAlignmentTableData}
        {valueMatrixTable}
      </div>
    );
  }

  renderButtonAlign(){
    let btnAlignClass = "animated infinite pulse";
    let btnString = "Alinear secuencias";
    if(this.state.loadingAlgorithm){
      console.log("Rendering button align en true");
      btnString = "Cargando...";
      btnAlignClass = "animated infinite jello";
    }
    return(
      <aside className="pure-u-24-24 action-align">
        <button className={"pure-button button-warning " + btnAlignClass}
              onClick={this._onClickAlignSequenceButton}>{btnString}</button>
      </aside>
    );
  }

  _renderAlignmentTableCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    // Set color green if they are the same else red color
    let color = RED_COLOR;
    if(this.state.alignment1Array[columnIndex-1] === this.state.alignment2Array[columnIndex-1]){
      color = GREEN_COLOR;
    }
    style.backgroundColor = color;
    style.color = "white";
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
        <h2 className="text-center file-text">Resultado alineación</h2>
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
      rowCount,
      showMatrixValue,
    } = this.state;

    let matrixValueRender = null;
    if(showMatrixValue){
      matrixValueRender = <ScrollSync>
        {({
          onScroll,
          scrollLeft,
          scrollTop,
        }) => {
          const leftColor =  TEXT_COLOR_HEACER_CELL;
          const topColor = TEXT_COLOR_HEACER_CELL;

          return (
            <div className={"GridRow "} >
              <div
                className={ "LeftSideGridContainer"}
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  color: leftColor,
                  backgroundColor: BACKGROUND_HEADER_COLOR
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
                  backgroundColor: BACKGROUND_HEADER_COLOR
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
                          backgroundColor: BACKGROUND_HEADER_COLOR,
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
                          color: TEXT_COLOR_BODY_CELL,
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
    }
    let buttonShowMatrixValue = null;
    if(this.state.showMatrixValue === false){
      buttonShowMatrixValue = (
          <button className="button-secondary pure-button"
            onClick={() => this.setState({showMatrixValue: !showMatrixValue})}
          >Ver matriz de resultados</button>
      )
    }
    return(
        <div className="pure-u-24-24 value-matrix">
          {buttonShowMatrixValue}
          {matrixValueRender}
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
        style.backgroundColor = RED_COLOR;
        style.color = "white";
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
        valueMatrix: null,
        showMatrixValue: false
      });
    }
  }
}

export default AlignSequence;
