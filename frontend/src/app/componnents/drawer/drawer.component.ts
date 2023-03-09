import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import Konva from 'konva';
import { Transformer } from 'konva/lib/shapes/Transformer';
import { KonvaService } from '../../services/konva.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  shapes: any = [];
  stage!: Stage;
  layer!: Layer;
  
  @ViewChild('stageContainer', { static: false }) stageContainer!: ElementRef;

  ngOnInit() {

  }
  
  ngAfterViewInit() {
    this.stage = new Stage({
      container: this.stageContainer.nativeElement,
      width: 500,
      height: 500
    });

    const layer = new Konva.Layer();

    const circle = new Konva.Circle({
      x: this.stage.width() / 2,
      y: this.stage.height() / 2,
      radius: 50,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 2,
      draggable: true,
    });

    layer.add(circle);
    this.stage.add(layer);
  }
}
