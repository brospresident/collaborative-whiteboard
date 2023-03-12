import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import Konva from 'konva';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit, OnDestroy {
  shapes: any = [];
  stage!: Stage;
  layer!: Layer;
  fill: any = 'black';
  stroke: any = 'black'
  @ViewChild('stageContainer', { static: false }) stageContainer!: ElementRef;
  isDrawing: any = false;
  isErasing: any = false;
  lastLine!: any;
  projectId: any;

  constructor(private router: Router, private route: ActivatedRoute, 
              private socketService: SocketService) {

  }

  ngOnInit() {
    this.projectId = this.route.snapshot.queryParamMap.get('project_id');
    let that = this;
    this.socketService.connect();
    this.socketService.on('newData', (data) => {
      data = JSON.parse(data);
      if (data.projectId == this.projectId && this.stage && this.layer) {
        that.clear();
        let shapes = data.shapes;
        for (let shape of shapes) {
          shape = JSON.parse(shape);
          console.log(shape)
          // that.layer.add(shape);
          // that.layer.draw();
          that.shapes.push(shape);
        }
        that.redrawLayer();
      }
    });
  }

  redrawLayer() {
    for (const shape of this.shapes) {
      let shapeObj = this.createShapes(shape) as any;
      this.layer.add(shapeObj);
    }
    this.layer.draw();
  }

  createShapes(obj: any) {
    let attrs = obj.attrs;
    switch(obj.className) {
      case "Rect": {
        return new Konva.Rect({
          x: attrs.x,
          y: attrs.y,
          fill: attrs.fill,
          stroke: attrs.stroke,
          strokeWidth: 2,
          draggable: true,
          width: attrs.width,
          height: attrs.height
        });
      }
    }
    return;
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  public emitEvent(): void {
    let data = this.buildSocketData();
    this.socketService.emit('newData', data);
  }

  public buildSocketData() {
    return JSON.stringify({
      shapes: this.shapes,
      projectId: this.projectId
    });
  }
  
  ngAfterViewInit() {
    if (!this.stage) {
      this.stage = new Konva.Stage({
        container: this.stageContainer.nativeElement,
        width: 1920,
        height: 1080
      });
  
      this.layer = new Konva.Layer();
  
      this.stage.add(this.layer);
  
      this.stage.on('mousedown touchstart', (event) => {
        this.startLine(event);
      });
  
      this.stage.on('mousemove touchmove', (event) => {
        this.draw(event);
      });
  
      this.stage.on('mouseup touchend', (event) => {
        this.endLine();
      });
    }
  }

  startErasing() {
    this.isErasing = true;
  }

  startDrawing() {
    this.isDrawing = true;
  }

  startLine(event: any) {
    if (!this.isDrawing) {
      return;
    }

    let stroke = '';
    if (this.isErasing) {
      stroke = 'white';
    } else {
      stroke = this.stroke;
    }

    const pos = this.stage.getPointerPosition();
    if (pos) {
      this.lastLine = new Konva.Line({
        stroke: stroke,
        strokeWidth: 5,
        globalCompositeOperation: 'source-over',
        points: [pos.x, pos.y]
      });
  
      this.layer.add(this.lastLine);
    }
  }

  draw(event: any) {
    if (!this.isDrawing) {
      return;
    }

    const pos = this.stage.getPointerPosition();
    if (pos) {
      const newPoints = this.lastLine.points().concat([pos.x, pos.y]);
      this.lastLine.points(newPoints);
      this.layer.batchDraw();
    }
  }

  endLine() {
    if (!this.isDrawing) {
      return;
    }

    this.shapes.push(this.lastLine);
    // this.isDrawing = false;
    this.lastLine = null;
    this.emitEvent();
  }

  drawCircle() {
    this.isDrawing = false;
    this.isErasing = false;

    const circle = new Konva.Circle({
      x: Math.random() * this.stage.width(),
      y: Math.random() * this.stage.height(),
      radius: 50,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: 2,
      draggable: true // make the circle draggable
    });
  
    // Create a transformer for the circle
    const tr = new Konva.Transformer({
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });
  
    // Add the transformer to the layer
    this.layer.add(tr);
  
    // Listen for click events on the circle to select it and enable the transformer
    circle.on('click', (event) => {
      const clickedOnTransformer = tr.nodes().indexOf(event.target) >= 0;
      if (!clickedOnTransformer) {
        tr.nodes([circle]);
        this.layer.draw();
      } else {
        tr.nodes([]);
        this.layer.draw();
      }
      event.cancelBubble = true;
    });
    
    this.layer.add(circle);
    this.layer.draw();

    this.shapes.push(circle);
    this.emitEvent();
  }

  drawRectangle() {
    this.isDrawing = false;
    this.isErasing = false;

    const rect = new Konva.Rect({
      x: Math.random() * this.stage.width(),
      y: Math.random() * this.stage.height(),
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: 2,
      draggable: true,
      width: 100,
      height: 50
    });
  
    // Create a transformer for the circle
    const tr = new Konva.Transformer({
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });
  
    // Add the transformer to the layer
    this.layer.add(tr);
  
    // Listen for click events on the circle to select it and enable the transformer
    rect.on('click', (event) => {
      const clickedOnTransformer = tr.nodes().indexOf(event.target) >= 0;
      if (!clickedOnTransformer) {
        tr.nodes([rect]);
        this.layer.draw();
      } else {
        tr.nodes([]);
        this.layer.draw();
      }
      event.cancelBubble = true;
    });
    
    this.layer.add(rect);
    this.layer.draw();

    this.shapes.push(rect);
    this.emitEvent();

  }

  clear() {
    // Destroy the current layer and create a new one
    this.layer.destroy();
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  
    // Reset the drawing state
    this.isDrawing = false;
    this.isErasing = false;

    this.lastLine = null;
  
    // Redraw the stage
    this.stage.batchDraw();

    this.shapes.length = 0;
    this.emitEvent();
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
}
