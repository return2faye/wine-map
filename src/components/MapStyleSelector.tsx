import React from 'react';
import { MapPin, Globe, Mountain, Palette } from 'lucide-react';

export interface MapStyle {
  id: string;
  name: string;
  url: string;
  attribution: string;
  icon: React.ReactNode;
  description: string;
}

export const mapStyles: MapStyle[] = [
  {
    id: 'carto-light',
    name: 'CartoDB Light',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: <Globe size={16} />,
    description: '简洁明亮的现代地图'
  },
  {
    id: 'carto-dark',
    name: 'CartoDB Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: <Palette size={16} />,
    description: '深色主题，护眼舒适'
  },
  {
    id: 'carto-voyager',
    name: 'CartoDB Voyager',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    icon: <MapPin size={16} />,
    description: '经典旅行风格地图'
  },
];

interface MapStyleSelectorProps {
  currentStyle: string;
  onStyleChange: (style: MapStyle) => void;
}

const MapStyleSelector: React.FC<MapStyleSelectorProps> = ({ currentStyle, onStyleChange }) => {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      zIndex: 1000,
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '1rem',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#333' }}>
        地图样式
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {mapStyles.map((style) => (
          <button
            key={style.id}
            onClick={() => onStyleChange(style)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              border: currentStyle === style.id ? '2px solid #8B0000' : '1px solid #ddd',
              borderRadius: '6px',
              background: currentStyle === style.id ? '#f8f9fa' : 'white',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              if (currentStyle !== style.id) {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.borderColor = '#8B0000';
              }
            }}
            onMouseLeave={(e) => {
              if (currentStyle !== style.id) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#ddd';
              }
            }}
          >
            <div style={{ color: currentStyle === style.id ? '#8B0000' : '#666' }}>
              {style.icon}
            </div>
            <div>
              <div style={{ 
                fontWeight: currentStyle === style.id ? 'bold' : 'normal',
                fontSize: '0.9rem',
                color: '#333'
              }}>
                {style.name}
              </div>
              <div style={{ 
                fontSize: '0.8rem',
                color: '#666',
                marginTop: '0.2rem'
              }}>
                {style.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapStyleSelector;
