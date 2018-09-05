import React from "react";
import ReactDOM from "react-dom";
import iChing from "i-ching";
import hexagrams from "./data";
import "./styles.css";

class App extends React.Component {
  state = {
    hexagrams,
    hexagram: [],
    found: null,
    auspicious: false
  };

  checkAuspiciousness = () => {
    const arr = new Uint8Array(1);
    window.crypto.getRandomValues(arr);

    if (arr[0] % 2 === 0) this.setState({ auspicious: true });
    else this.setState({ auspicious: false });
  };

  castHexagram = () => {
    const arr = new Uint8Array(6);
    window.crypto.getRandomValues(arr);

    const numbers = [];
    arr.forEach(each => numbers.push(each));

    let binary = "";
    const hexagram = numbers.map(each => {
      // 1: yang
      // 0: yin
      switch (0) {
        case each % 4:
          binary += "0";
          return 4; // 4: new yin
        case each % 2:
          binary += "0";
          return 2; // 2: old yin
        case (each + 1) % 4:
          binary += "1";
          return 3; // 3: new yang
        case (each + 1) % 2:
          binary += "1";
          return 1; // 1: old yang
      }
    });
    const found = iChing.hexagrams.find(each => {
      let reversed = each.binary
        .split("")
        .reverse()
        .join("");
      return reversed === binary;
    });
    console.log(found.number, hexagram, binary, found);
    this.setState({ hexagram, binary, found });
  };

  render() {
    // console.log(iChing.hexagram(8).topTrigram.familyRelationship);
    // console.log(iChing.hexagram(5).changeTo(43).to.names[0]);
    // console.log(iChing);
    // console.log(iChing.trigram(1));

    const { hexagram, found } = this.state;

    const toPrintReversed = [...hexagram];
    toPrintReversed.reverse();

    return (
      <div className="App">
        <br />
        <br />
        {this.state.auspicious ? (
          <button onClick={this.castHexagram}>Cast Hexagram</button>
        ) : (
          <button onClick={this.checkAuspiciousness}>
            Is it a good time to cast?
          </button>
        )}
        {hexagram
          ? toPrintReversed.map((each, i) => {
              return <div key={i}>{each}</div>;
            })
          : null}
        {this.state.binary}
        {found
          ? found.names.map((each, i) => {
              if (i === found.names.length - 1)
                return <div key={i}>{each}</div>;
              return <div key={i}>{each}, </div>;
            })
          : null}
        <br />
        {this.state.hexagrams[1].judgement.translation
          .split("\n")
          .map((textBlock, i) => <p key={i}>{textBlock}</p>)}
        <p>{this.state.hexagrams[1].image.description}</p>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
