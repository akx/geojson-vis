import React, {Component} from 'react';
import './App.css';
import 'leaflet/dist/leaflet.css';
import {Map, TileLayer, GeoJSON} from 'react-leaflet';

const parseJSONFile = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      resolve(JSON.parse(event.target.result));
    } catch (e) {
      reject(e);
    }
  };
  reader.onerror = (error) => {
    reject(error);
  };
  reader.readAsText(file);
});

class App extends Component {
  constructor() {
    super();
    this.state = {
      dataUrl: '',
      json: null,
      lat: 60.1699,
      lng: 24.9384,
      zoom: 13,
      weight: 5,
      opacity: 0.65,
      color: '#FF5500',
      showControls: true,
    };
    this.getStyle = this.getStyle.bind(this);
  }

  loadFromUrl(url) {
    fetch(url)
      .then((r) => r.json())
      .then((json) => this.setState({json}))
      .catch((e) => {
        console.error(e);
        alert(`Could not read URL ${url}: ${e}`);
      });
  }

  loadFromFile(file) {
    parseJSONFile(file).then((json) => {
      this.setState({json});
    }).catch((e) => {
      console.error(e);
      alert(`Could not read file ${file}: ${e}`);
    });
  }

  getStyle(feature, layer) {
    const {color, weight, opacity} = this.state;
    return {color, weight, opacity};
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="App">
        <div className={"controls" + (!this.state.showControls ? ' hidden' : '')}>
          <h2>Input Data</h2>
          <h3>Load from URL</h3>
          <input type="url" value={this.state.dataUrl} onChange={(e) => this.setState({dataUrl: e.target.value})} />
          <button onClick={() => this.loadFromUrl(this.state.dataUrl)}>Load</button>
          <h3>Use local JSON</h3>
          <input type="file" onChange={(e) => this.loadFromFile(e.target.files[0])} />
          <h2>Style</h2>
          <label>
            <span>Color</span>
            <input type="color" value={this.state.color} onChange={(e) => this.setState({color: e.target.value})} />
          </label>
          <label>
            <span>Weight</span>
            <input type="number" value={this.state.weight}
                   onChange={(e) => this.setState({weight: parseFloat(e.target.value) || 5})} />
          </label>
          <label>
            <span>Opacity</span>
            <input type="number" value={this.state.opacity} step="0.05" min="0" max="1"
                   onChange={(e) => this.setState({opacity: parseFloat(e.target.valueAsNumber) || 0.65})} />
          </label>
        </div>
        <div className="map">
          <Map center={position} zoom={this.state.zoom}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
            />
            {this.state.json ? <GeoJSON data={this.state.json} style={this.getStyle} /> : null}
          </Map>
        </div>
        <button
          className="controls-button"
          title="Show/hide controls"
          onClick={(e) => this.setState({showControls: !this.state.showControls})}>
          Controls
        </button>
      </div>
    );
  }
}

export default App;
