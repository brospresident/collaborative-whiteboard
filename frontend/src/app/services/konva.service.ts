import { Injectable } from '@angular/core';
import { Line } from 'konva/lib/shapes/Line';

@Injectable({
  providedIn: 'root'
})
export class KonvaService {
  brushSize!: number;
  brushOpacity!: number;

  brush(pos: any, size: any, color: string, opacity: number) {
    this.brushSize = size;
    this.brushOpacity = opacity;
    return new Line({
      stroke: color,
      strokeWidth: size,
      globalCompositeOperation: 'source-over',
      points: [pos.x, pos.y, pos.x, pos.y],
      lineCap: 'round',
      lineJoin: 'round',
      opacity: opacity,
      tension: 0,
    });
  }

  erase(pos: any, size: any) {
    return new Line({
      stroke: '#ffffff',
      strokeWidth: size,
      globalCompositeOperation: 'destination-out',
      points: [pos.x, pos.y, pos.x, pos.y],
      lineCap: 'round',
      lineJoin: 'round'
    });
  }
}
