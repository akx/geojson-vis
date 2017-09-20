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
    };
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
    return {
      color: '#006400',
      weight: 5,
      opacity: 0.65,
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <div className="App">
        <div className="controls">
          <h2>Input Data</h2>
          <h3>Load from URL</h3>
          <input type="url" value={this.state.dataUrl} onChange={(e) => this.setState({dataUrl: e.target.value})} />
          <button onClick={() => this.loadFromUrl(this.state.dataUrl)}>Load</button>
          <h3>Use local JSON</h3>
          <input type="file" onChange={(e) => this.loadFromFile(e.target.files[0])} />
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
      </div>
    );
  }
}

export default App;
