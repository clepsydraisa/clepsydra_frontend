/**
 * Map Performance Optimization Utilities
 * 
 * This module provides utilities for optimizing map performance,
 * including icon caching, batch processing, and performance monitoring.
 */

import L from 'leaflet';

// Global icon cache for better performance
const globalIconCache = new Map<string, L.Icon | L.DivIcon>();

/**
 * Clear the global icon cache
 */
export const clearIconCache = (): void => {
  globalIconCache.clear();
};

/**
 * Get cached icon or create new one
 */
export const getCachedIcon = (
  key: string,
  iconFactory: () => L.Icon | L.DivIcon
): L.Icon | L.DivIcon => {
  if (globalIconCache.has(key)) {
    return globalIconCache.get(key)!;
  }
  
  const icon = iconFactory();
  globalIconCache.set(key, icon);
  return icon;
};

/**
 * Batch process function for better performance
 */
export const batchProcess = <T>(
  items: T[],
  batchSize: number,
  processor: (batch: T[]) => void,
  onComplete?: () => void
): void => {
  let index = 0;
  
  const processBatch = () => {
    const endIndex = Math.min(index + batchSize, items.length);
    const batch = items.slice(index, endIndex);
    
    processor(batch);
    
    index = endIndex;
    
    if (index < items.length) {
      // Use requestAnimationFrame for smooth processing
      requestAnimationFrame(processBatch);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  processBatch();
};

/**
 * Debounced function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
};

/**
 * Create a loading indicator element
 */
export const createLoadingIndicator = (message = 'Carregando pontos...'): HTMLElement => {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(4px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  `;
  
  const content = document.createElement('div');
  content.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 24px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  `;
  
  const spinner = document.createElement('div');
  spinner.style.cssText = `
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  `;
  
  const text = document.createElement('div');
  text.style.cssText = `
    color: #374151;
    font-size: 14px;
    font-weight: 500;
  `;
  text.textContent = message;
  
  content.appendChild(spinner);
  content.appendChild(text);
  overlay.appendChild(content);
  
  // Add spin animation if not already present
  if (!document.querySelector('#map-spinner-style')) {
    const style = document.createElement('style');
    style.id = 'map-spinner-style';
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }
  
  return overlay;
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  startTimer(name: string): void {
    this.metrics.set(name, performance.now());
  }
  
  endTimer(name: string): number {
    const start = this.metrics.get(name);
    if (start === undefined) {
      console.warn(`Timer '${name}' was not started`);
      return 0;
    }
    
    const duration = performance.now() - start;
    this.metrics.delete(name);
    console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    return duration;
  }
  
  getMetrics(): Map<string, number> {
    return new Map(this.metrics);
  }
}

/**
 * Optimized marker creation with caching
 */
export const createOptimizedMarker = (
  coord: [number, number],
  icon: L.Icon | L.DivIcon,
  onClick: () => void
): L.Marker => {
  const marker = L.marker(coord, { icon });
  marker.on('click', onClick);
  return marker;
};

/**
 * Batch add markers to map for better performance
 */
export const batchAddMarkers = (
  markers: L.Marker[],
  map: L.Map,
  layerGroup: L.LayerGroup,
  batchSize = 50
): void => {
  batchProcess(
    markers,
    batchSize,
    (batch) => {
      batch.forEach(marker => {
        marker.addTo(layerGroup);
      });
    },
    () => {
      console.log(`✅ ${markers.length} marcadores adicionados ao mapa`);
    }
  );
}; 