import * as ws from  'webgpu-simplified';
import { getCylinderData } from '../../common/vertex-data';
import * as cc from './ch03-common';
import { vec3, mat4 } from 'gl-matrix';

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const init = await ws.initWebGPU({canvas, msaaCount: 4});

    var data = getCylinderData(0.5, 1.5, 3, 30);
    const p = await cc.createPipeline(init, 'line-list', data);
   
    let modelMat = mat4.create();
    let vt = ws.createViewTransform();
    let viewMat = vt.viewMat;
    let projectMat = mat4.create();
    let mvpMat = mat4.create();
   
    let aspect = init.size.width / init.size.height;  
    let rotation = vec3.fromValues(0, 0, 0);    
    let camera = ws.getCamera(canvas, vt.cameraOptions); 

    var gui = ws.getDatGui();
    document.querySelector('#gui').append(gui.domElement);
    const params = {
        rotationSpeed: 0.9,
        objectColor: '#ff0000',
        wireframeColor: '#ffff00',
        plotType: 'shapeAndWireframe',
        nSegments: 30,
        radiusIn: 0.5,
        radiusOut: 1.5,
        height: 3.1,
    };
    
    let dataChanged = false;
    
    gui.add(params, 'rotationSpeed', 0, 5, 0.1);      
    gui.addColor(params, 'objectColor');
    gui.addColor(params, 'wireframeColor');
    gui.add(params, 'plotType', ['shapeAndWireframe', 'shapeOnly', 'wireframeOnly']);
    var folder = gui.addFolder('SetCylinderParameters');
    folder.open();
    folder.add(params, 'nSegments', 5, 100, 1).onChange(() => { dataChanged = true; });
    folder.add(params, 'radiusIn', 0, 3, 0.1).onChange(() => {                  
        dataChanged = true;
    }); 
    folder.add(params, 'radiusOut', 0.2, 5, 0.1).onChange(() => {                  
        dataChanged = true;
    }); 
    folder.add(params, 'height', 0.1, 5, 0.1).onChange(() => {                  
        dataChanged = true;
    }); 
    
    var stats = ws.getStats();
    let start = Date.now();
    const frame = () => {  
        stats.begin(); 

        projectMat = ws.createProjectionMat(aspect);
        if(camera.tick()){
            viewMat = camera.matrix;
        }
        var dt = (Date.now() - start)/1000;             
        rotation[0] = Math.sin(dt * params.rotationSpeed);
        rotation[1] = Math.cos(dt * params.rotationSpeed); 
         modelMat = ws.createModelMat([0,0,0], rotation);
        mvpMat = ws.combineMvpMat(modelMat, viewMat, projectMat);

        cc.updateUniformBuffers(init.device, p, params, mvpMat);

        if(dataChanged){
            let len = data.positions.length;
            data = getCylinderData(params.radiusIn, params.radiusOut, params.height, params.nSegments);
            cc.updateVertexBuffers(init.device, p, data, len);
            dataChanged = false;
        }
        
        cc.draw(init, p, params.plotType, data); 

        requestAnimationFrame(frame);
        stats.end();
    };
    requestAnimationFrame(frame);
}

run();