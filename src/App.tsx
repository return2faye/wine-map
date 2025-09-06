import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Wine } from './types/wine';
import { sampleWines } from './data/wines';
import WineDetail from './components/WineDetail';
import CustomMarker from './components/CustomMarker';
import MapStyleSelector, { MapStyle, mapStyles } from './components/MapStyleSelector';
import 'leaflet/dist/leaflet.css';

// 修复Leaflet默认图标问题
import L from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function App() {
  const [selectedWine, setSelectedWine] = useState<Wine | null>(null);
  const [wines] = useState<Wine[]>(sampleWines);
  const [currentMapStyle, setCurrentMapStyle] = useState<MapStyle>(mapStyles[0]);

  const handleMarkerClick = (wine: Wine) => {
    setSelectedWine(wine);
  };

  const handleCloseDetail = () => {
    setSelectedWine(null);
  };

  const handleMapStyleChange = (style: MapStyle) => {
    setCurrentMapStyle(style);
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxZoom={18}
        zoomSnap={0.5}
        zoomDelta={0.5}
        wheelPxPerZoomLevel={120}
        style={{ height: '100vh', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        touchZoom={true}
        boxZoom={true}
        keyboard={true}
        dragging={true}
        zoomAnimation={true}
        fadeAnimation={true}
        markerZoomAnimation={true}
        worldCopyJump={false}
        maxBounds={[[-85, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
        noWrap={true}
      >
        <TileLayer
          attribution={currentMapStyle.attribution}
          url={currentMapStyle.url}
          subdomains="abcd"
          maxZoom={20}
          noWrap={true}
        />
        
        {wines.map((wine) => (
          <Marker
            key={wine.id}
            position={[wine.coordinates.lat, wine.coordinates.lng]}
            icon={L.divIcon({
              className: 'custom-wine-marker',
              html: `<div class="custom-wine-marker ${wine.color || 'red'}"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
            eventHandlers={{
              click: () => handleMarkerClick(wine),
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{wine.name}</h3>
                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                  {wine.region}, {wine.country}
                </p>
                {wine.rating && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: '#ffc107' }}>
                      {'★'.repeat(Math.floor(wine.rating))}
                      {'☆'.repeat(5 - Math.floor(wine.rating))}
                    </span>
                    <span style={{ marginLeft: '0.5rem', fontSize: '0.8rem' }}>
                      {wine.rating}/5
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <MapStyleSelector
        currentStyle={currentMapStyle.id}
        onStyleChange={handleMapStyleChange}
      />

      <AnimatePresence>
        {selectedWine && (
          <WineDetail
            wine={selectedWine}
            onClose={handleCloseDetail}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
