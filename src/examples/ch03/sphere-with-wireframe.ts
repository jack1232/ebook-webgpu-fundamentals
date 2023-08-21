import * as ws from 'webgpu-simplified';
import { getSphereData } from '../../common/vertex-data';
import * as cc from './ch03-common';
import { vec3, mat4 } from 'gl-matrix';

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const init = await ws.initWebGPU({canvas, msaaCount: 4});

    var data = getSphereData(2, 20, 32);
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
        uSegments: 20,
        vSegments: 32,
        radius: 2,
    };
    
    let dataChanged = false;
    
    gui.add(params, 'rotationSpeed', 0, 5, 0.1);      
    gui.addColor(params, 'objectColor');
    gui.addColor(params, 'wireframeColor');
    gui.add(params, 'plotType', ['shapeAndWireframe', 'shapeOnly', 'wireframeOnly']);
    var folder = gui.addFolder('SetSphereParameters');
    folder.open();
    folder.add(params, 'uSegments', 5, 100, 1).onChange(() => {    
        dataChanged = true;
    });
    folder.add(params, 'vSegments', 5, 100, 1).onChange(() => {    
        dataChanged = true;            
    });
    folder.add(params, 'radius', 0.1, 5, 0.1).onChange(() => {                  
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
            data = getSphereData(params.radius, params.uSegments, params.vSegments);
            cc.updateVertexBuffers(init.device, p, data, len);
            dataChanged = false;
        }
        
        cc.draw(init, p, params.plotType, data); 

        requestAnimationFrame(frame);
        stats.end();
    };
    frame();
}

run();