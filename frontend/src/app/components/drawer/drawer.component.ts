import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Stage } from 'konva/lib/Stage';
import { Layer } from 'konva/lib/Layer';
import Konva from 'konva';
import { ActivatedRoute, Router } from '@angular/router';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { RpcService } from 'src/app/services/rpc.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit, OnDestroy {
  shapes: any[] = [];
  stage!: Stage;
  layer!: Layer;
  fill: any = 'black';
  stroke: any = 'black'
  @ViewChild('stageContainer', { static: false }) stageContainer!: ElementRef;
  isDrawing: any = false;
  isErasing: any = false;
  lastLine!: any;
  projectId: any;
  timeout: any;
  socketShapes: any[] = [];

  constructor(private router: Router, 
              private route: ActivatedRoute, 
              private socketService: SocketService,
              private userService: UserService,
              private rpcService: RpcService
    ) {
    this.projectId = this.route.snapshot.queryParamMap.get('project_id');
    this.socketService.connect(this.projectId);
    let that = this;
    this.socketService.on('client:draw', (data) => {
      data = data as any;
      data = JSON.parse(data);
      that.socketShapes.length = 0;
      if (data.projectId == that.projectId && that.stage && that.layer && that.userService.getUser() != data.sender) {
        that.clear(true);
        let _shapes = data.shapes;
        if (!_shapes) {
          return;
        }
        for (let shape of _shapes) {
          shape = JSON.parse(shape);
          // console.log(shape);
          that.socketShapes.push(shape);
        }
        that.redrawLayer();
      }
    });
  }

  sendData() {
    let that = this;
    if (this.timeout) {
      clearTimeout(that.timeout);
    }

    this.timeout = setTimeout(() => {
      that.emitEvent();
    }, 1000);
  }

  ngOnInit() {
    console.log('init boy')
    let that = this;
    this.rpcService.ask('projects.get_shapes', {projectId: this.projectId}, (error: any, result: any) => {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log(result);
        let shapes = result.result.shapes.map((shape: any) => JSON.parse(shape));
        that.socketShapes = shapes;
        that.redrawLayer();
      }
    });
  }

  redrawLayer() {
    this.shapes.length = 0;
    for (const shape of this.socketShapes) {
      let shapeObj = this.createShapes(shape) as any;
      this.shapes.push(shapeObj);
      this.layer.add(shapeObj);
    }
    this.layer.draw();
  }

  createShapes(obj: any) {
    let attrs = obj.attrs;
    switch(obj.className) {
      case "Rect": {
        return new Konva.Rect(attrs);
      }
      case "Circle": {
        return new Konva.Circle(attrs);
      }
      case "Line": {
        return new Konva.Line(attrs);
      }
    }
    return;
  }

  ngOnDestroy(): void {
    this.socketService.disconnect(this.projectId);
  }

  public emitEvent(): void {
    let data = this.buildSocketData();
    // console.log(data);
    this.socketService.emit('server:draw', data);
    // this.socketService.disconnect();
    // this.socketService.connect();
  }

  public buildSocketData() {
    let jsonShapes = [];
    for (let shape of this.shapes) {
      // console.log(shape);
      if (!shape) continue;
      jsonShapes.push(shape.toJSON());
    }

    return JSON.stringify({
      projectId: this.projectId,
      shapes: jsonShapes,
      sender: this.userService.getUser()
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
    if (pos && this.lastLine) {
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
    this.sendData();
  }

  drawCircle() {
    this.isDrawing = false;
    this.isErasing = false;
  
    // Remove the random x and y coordinates for the circle
    const circle = new Konva.Circle({
      x: 0,
      y: 0,
      radius: 50,
      fill: this.fill,
      stroke: this.stroke,
      strokeWidth: 2,
      draggable: true // make the circle draggable
    });

    circle.on('dragend', (event) => {
      // TOOD: call socket
      this.sendData();
    });
  
    // Create a transformer for the circle
    const tr = new Konva.Transformer({
      enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
    });
  
    // Add the transformer to the layer
    this.layer.add(tr);
  
    // Listen for click events on the stage to create the circle at the clicked position
    this.stage.on('click', (event) => {
      circle.position({
        x: event.evt.offsetX,
        y: event.evt.offsetY,
      });
      // Add the circle to the layer
      this.layer.add(circle);
      // Enable the transformer for the circle
      tr.nodes([circle]);
      // Update the layer
      this.layer.batchDraw();
      // Remove the click event listener from the stage
      this.stage.off('click');

      this.shapes.push(circle);
    
      this.sendData();
    });
  
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

    // Listen for click events on the stage to create the circle at the clicked position
    this.stage.on('click', (event) => {
      rect.position({
        x: event.evt.offsetX,
        y: event.evt.offsetY,
      });
      // Add the circle to the layer
      this.layer.add(rect);
      // Enable the transformer for the circle
      tr.nodes([rect]);
      // Update the layer
      this.layer.batchDraw();
      // Remove the click event listener from the stage
      this.stage.off('click');

      this.shapes.push(rect);
    
      this.sendData();
    });

  }

  clear(isSocket: boolean) {
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

    console.log('finished cleaning');

    if (isSocket) return;
    this.shapes.length = 0;
    this.sendData();
  }

  goToDashboard() {
    let obj = JSON.stringify({id: this.projectId});
    console.log(obj);
    this.socketService.emit('leftDrawer', obj);
    this.router.navigate(['/dashboard']);
  }
}
