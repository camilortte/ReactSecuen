import React, { Component } from 'react';
import NeedlemanWunschAlgorithm from './AlgoritmoNeedlemanWunsch/NeedlemanWunsch'
import { Grid, ScrollSync, AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'; // only needs to be imported once
import "./global/css/example.css";
import scrollbarSize from "dom-helpers/util/scrollbarSize";
import cn from "classnames";
const LEFT_COLOR_FROM = hexToRgb("#61dafb");
const LEFT_COLOR_TO = hexToRgb("#BC3959");
const TOP_COLOR_FROM = hexToRgb("#000000");
const TOP_COLOR_TO = hexToRgb("#333333");

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null;
}

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
      valueMatrix: null,

      columnWidth: 50,
      columnCount: 50,
      height: 300,
      overscanColumnCount: 0,
      overscanRowCount: 5,
      rowHeight: 50,
      rowCount: 100
    };

    this.align();
    this._renderBodyCell = this._renderBodyCell.bind(this);
    this._renderHeaderCell = this._renderHeaderCell.bind(this);
    this._renderLeftSideCell = this._renderLeftSideCell.bind(this);
    this._renderLeftHeaderCell = this._renderLeftHeaderCell.bind(this);
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
      // needlemanWunsch.printValuematrix();
      let resultAlignment = needlemanWunsch.makeAlignment();
      this.setState({
        alignment1: resultAlignment[0],
        alignment2: resultAlignment[1],
        valueMatrix: needlemanWunsch.matrix_value,
        rowCount: needlemanWunsch.matrix_value.length,
        columnCount: needlemanWunsch.matrix_value[0].length + 1
      });
    }
  }

  render() {
    let valueMatrixTable = null;
    if(this.state.valueMatrix){
      valueMatrixTable = this.renderTableValues();
    }

    return (
      <div className="App-Align-sequence pure-g">
        {/*<h1>{this.state.sequence1}</h1>*/}
        {/*<h1>{this.state.sequence2}</h1>*/}
        {/*<br/>*/}
        {/*<h1>{this.state.alignment1}</h1>*/}
        {/*<h1>{this.state.alignment2}</h1>*/}
        {valueMatrixTable}

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
                              backgroundColor: `rgb(${middleBackgroundColor.r},${middleBackgroundColor.g},${middleBackgroundColor.b})`,
                              color: middleColor,
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
    return (
      <div className={"headerCell"} key={key} style={style}>
        {this.state.valueMatrix[rowIndex][columnIndex-1]}
      </div>
    );
  }

  _renderHeaderCell({ columnIndex, key, rowIndex, style }) {
    if (columnIndex < 1) {
      return;
    }
    return this._renderLeftHeaderCell({ columnIndex, key, rowIndex, style });
  }

  _renderLeftHeaderCell({ columnIndex, key, style }) {
    const rowClass =
      columnIndex % 2 === 0
        ? columnIndex % 2 === 0 ? "evenRow" : "oddRow"
        : columnIndex % 2 !== 0 ? "evenRow" : "oddRow";
    const classNames = cn(rowClass, "cell");

    return (
      <div className={"headerCell " + classNames} key={key} style={style}>
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
        sequence2Array: sequence2Array
      });

      this.align(nextProps.sequence1, nextProps.sequence2);
    }
  }
}

export default AlignSequence;
