// @src/app.jsx

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";

import { EditControl } from "react-leaflet-draw";

function rand(min, max) {
  return min + Math.random() * (max - min);
}

const colors = [];

function randomColor() {
  const h = rand(1, 360);
  const s = rand(50, 100);
  const l = rand(50, 100);
  const color = "hsl(" + h + "," + s + "%," + l + "%)";

  if (colors.includes(color)) {
    return randomColor();
  }

  colors.push(color);

  return color;
}

const App = () => {
  const position = [-15.877614, -52.313539];

  const [mapLayers, setMapLayers] = useState([]);
  const [zoom, setZoom] = useState(17);

  useEffect(() => {
    setZoom(17);
  }, []);

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;

      setMapLayers((layers) => [
        ...layers,
        { id: _leaflet_id, latlngs: layer.getLatLngs()[0] },
      ]);
    }
  };

  const _onEdited = (e) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id, editing }) => {
      setMapLayers((layers) =>
        layers.map((l) =>
          l.id === _leaflet_id
            ? { ...l, latlngs: { ...editing.latlngs[0] } }
            : l
        )
      );
    });
  };

  const _onDeleted = (e) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
    });
  };

  const _onDrawStart = (e) => {
    console.log(e);
  };

  return (
    <>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ minHeight: "100vh", minWidth: "100vw" }}
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onDrawStart={_onDrawStart}
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: {
                shapeOptions: {
                  color: randomColor(),
                },
                clickable: true,
                showLength: true,
              },
            }}
          />
        </FeatureGroup>
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        />
      </MapContainer>
      <div className="modal-fixed">
        <pre>{JSON.stringify(mapLayers, null, 4)}</pre>
      </div>
    </>
  );
};

export default App;
