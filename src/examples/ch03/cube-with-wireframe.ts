import shader from './unlit.wgsl';
import * as ws from 'webgpu-simplified';
import { getCubeData } from '../../common/vertex-data';
import { vec3, mat4 } from 'gl-matrix';

const createPipeline = async (init: ws.IWebGPUInit, wireframePrimitive: GPUPrimitiveTopology, 
data:any): Promise<ws.IPipeline> => {
    
    // pipeline for shape
    const descriptor = ws.createRenderPipelineDescriptor({
        init, shader,
        buffers: ws.setVertexBuffers(['float32x3']),
    });
    const pipeline = await init.device.createRenderPipelineAsync(descriptor);
    
    // pipeline for wireframe
    const descriptor2 = ws.createRenderPipelineDescriptor({
        init, shader,
        primitiveType: wireframePrimitive,
        buffers: ws.setVertexBuffers(['float32x3']),
    });
    const pipeline2 = await init.device.createRenderPipelineAsync(descriptor2);
    
    // create vertex and index buffers
    const vertexBuffer = ws.createBufferWithData(init.device, data.positions);
    //for shape
    const indexBuffer = ws.createBufferWithData(init.device, data.indices); 
    // for wireframe
    const indexBuffer2 = ws.createBufferWithData(init.device, data.indices2);

    // uniform buffer for transform matrix (same for shape and wireframe)
    const  uniformBuffer = ws.createBuffer(init.device, 64);

    // color uniform buffer for shape and wireframe
    const  colorUniformBuffer = ws.createBuffer(init.device, 16);
    const  colorUniformBuffer2 = ws.createBuffer(init.device, 16);
    
    // uniform bind groups for shape and wireframe
    const uniformBindGroup = ws.createBindGroup(init.device, pipeline.getBindGroupLayout(0), [uniformBuffer, colorUniformBuffer]);
    const uniformBindGroup2 = ws.createBindGroup(init.device, pipeline2.getBindGroupLayout(0), [uniformBuffer, colorUniformBuffer2]);

    // create depth view (same for shape and wireframe)
    const depthTexture = ws.createDepthTexture(init);
   
    return {
        pipelines: [pipeline, pipeline2],
        vertexBuffers: [vertexBuffer, indexBuffer, indexBuffer2],
        uniformBuffers: [uniformBuffer, colorUniformBuffer, colorUniformBuffer2],
        uniformBindGroups: [uniformBindGroup, uniformBindGroup2],
        depthTextures: [depthTexture],
    };
}

const draw = (init:ws.IWebGPUInit, p:ws.IPipeline, plotType:string, data:any) => {  
    const commandEncoder =  init.device.createCommandEncoder();
    const desciptor = ws.createRenderPassDescriptor({
        init, depthView: p.depthTextures[0].createView(),
    });
    const renderPass = commandEncoder.beginRenderPass(desciptor);

     // draw shape
     const drawShape = () => {
        renderPass.setPipeline(p.pipelines[0]);
        renderPass.setVertexBuffer(0, p.vertexBuffers[0]);
        renderPass.setBindGroup(0, p.uniformBindGroups[0]);
        renderPass.setIndexBuffer(p.vertexBuffers[1], 'uint32');
        renderPass.drawIndexed(data.indices.length);
    }

    // draw wireframe
    const drawWireframe = () => {
        renderPass.setPipeline(p.pipelines[1]);
        renderPass.setVertexBuffer(0, p.vertexBuffers[0]);
        renderPass.setBindGroup(0, p.uniformBindGroups[1]);
        renderPass.setIndexBuffer(p.vertexBuffers[2], 'uint32');
        renderPass.drawIndexed(data.indices2.length);
    }

    if(plotType === 'wireframeOnly'){
        drawWireframe();
    } else if(plotType === 'shapeOnly'){
        drawShape();
    } else {
        drawShape();
        drawWireframe();
    }

    renderPass.end();
    init.device.queue.submit([commandEncoder.finish()]);
}

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const init = await ws.initWebGPU({canvas});
    const data = getCubeData();
    const p = await createPipeline(init, 'line-list', data);
      
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
        cubeColor: '#ff0000',
        wireframeColor: '#ffff00',
        plotType: 'shapeAndWireframe',
    };
    
    gui.add(params, 'rotationSpeed', 0, 5, 0.1);      
    gui.addColor(params, 'cubeColor');
    gui.addColor(params, 'wireframeColor');
    gui.add(params, 'plotType', ['shapeAndWireframe', 'shapeOnly', 'wireframeOnly']);
    
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

        // update uniform buffers for transformation and color
        init.device.queue.writeBuffer(p.uniformBuffers[0], 0, mvpMat as ArrayBuffer);  
        init.device.queue.writeBuffer(p.uniformBuffers[1], 0, ws.hex2rgb(params.cubeColor));  
        init.device.queue.writeBuffer(p.uniformBuffers[2], 0, ws.hex2rgb(params.wireframeColor)); 

        draw(init, p, params.plotType, data); 

        requestAnimationFrame(frame);
        stats.end();
    };
    frame();
}

run();