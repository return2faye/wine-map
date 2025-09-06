import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Calendar, DollarSign, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Wine as WineType } from '../types/wine';

interface WineDetailProps {
  wine: WineType;
  onClose: () => void;
}

const WineDetail: React.FC<WineDetailProps> = ({ wine, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // 获取所有图片，优先使用images数组，如果没有则使用单个image
  const allImages = wine.images && wine.images.length > 0 ? wine.images : (wine.image ? [wine.image] : []);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };
  const formatPrice = (price?: number) => {
    if (!price) return '价格未知';
    return `S$${price}`;
  };

  const formatDate = (date?: string) => {
    if (!date) return '日期未知';
    return new Date(date).toLocaleDateString('zh-CN');
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="rating">
        <div className="stars">
          {'★'.repeat(fullStars)}
          {hasHalfStar && '☆'}
          {'☆'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0))}
        </div>
        <span>{rating}/5</span>
      </div>
    );
  };

  const getColorIcon = (color?: string) => {
    switch (color) {
      case 'red':
        return '🍷';
      case 'white':
        return '🥂';
      case 'rose':
        return '🍾';
      case 'sparkling':
        return '🥂';
      default:
        return '🍷';
    }
  };

  return (
    <motion.div
      className="wine-detail-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="wine-detail-card"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
            {getColorIcon(wine.color)}
          </div>
          <h1 className="wine-title">{wine.name}</h1>
          <p className="wine-region">
            <MapPin size={16} style={{ display: 'inline', marginRight: '0.5rem' }} />
            {wine.region}, {wine.country}
          </p>
        </div>

        {allImages.length > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '1.5rem', position: 'relative' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src={allImages[currentImageIndex]}
                alt={`${wine.name} - 图片 ${currentImageIndex + 1}`}
                className="wine-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    style={{
                      position: 'absolute',
                      left: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                    }}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '40px',
                      height: '40px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.7)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
                    }}
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  {allImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        border: 'none',
                        background: index === currentImageIndex ? '#8B0000' : '#ccc',
                        cursor: 'pointer',
                        transition: 'background 0.3s ease'
                      }}
                    />
                  ))}
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                  图片 {currentImageIndex + 1} / {allImages.length}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="wine-info">
          {wine.vintage && (
            <div className="info-item">
              <div className="info-label">年份</div>
              <div className="info-value">{wine.vintage}</div>
            </div>
          )}

          {wine.winery && (
            <div className="info-item">
              <div className="info-label">酒庄</div>
              <div className="info-value">{wine.winery}</div>
            </div>
          )}

          {wine.grapeVariety && (
            <div className="info-item">
              <div className="info-label">葡萄品种</div>
              <div className="info-value">{wine.grapeVariety}</div>
            </div>
          )}

          {wine.alcoholContent && (
            <div className="info-item">
              <div className="info-label">酒精度</div>
              <div className="info-value">{wine.alcoholContent}%</div>
            </div>
          )}

          {wine.price && (
            <div className="info-item">
              <div className="info-label">
                <DollarSign size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                价格
              </div>
              <div className="info-value">{formatPrice(wine.price)}</div>
            </div>
          )}

          {wine.rating && (
            <div className="info-item">
              <div className="info-label">
                <Star size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                评分
              </div>
              <div className="info-value">{renderStars(wine.rating)}</div>
            </div>
          )}

          {wine.dateConsumed && (
            <div className="info-item">
              <div className="info-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                品尝日期
              </div>
              <div className="info-value">{formatDate(wine.dateConsumed)}</div>
            </div>
          )}
        </div>

        {wine.tastingNotes && (
          <div className="comment-section">
            <div className="comment-title">品酒笔记</div>
            <div className="comment-text">{wine.tastingNotes}</div>
          </div>
        )}

        {wine.personalComment && (
          <div className="comment-section">
            <div className="comment-title">我的评价</div>
            <div className="comment-text">{wine.personalComment}</div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WineDetail;
