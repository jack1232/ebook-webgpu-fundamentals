import shader from './unlit.wgsl';
import * as ws from  'webgpu-simplified';
import { mat4 } from 'gl-matrix';

export const createPipeline = async (init:ws.IWebGPUInit, wireframePrimitiveType: GPUPrimitiveTopology, 
data: any): Promise<ws.IPipeline> => {
    // pipeline for shape
    const descriptor = ws.createRenderPipelineDescriptor({
        init,
        shader: shader,
        buffers: ws.setVertexBuffers(['float32x3']),
    });
    const pipeline = await init.device.createRenderPipelineAsync(descriptor);

    // pipeline for shape
    const descriptor2 = ws.createRenderPipelineDescriptor({
        init,
        primitiveType: wireframePrimitiveType,
        shader: shader,
        buffers: ws.setVertexBuffers(['float32x3']),
    });
    const pipeline2 = await init.device.createRenderPipelineAsync(descriptor2);

    // create vertex and index buffers
    const vertexBuffer = ws.createBufferWithData(init.device, data.positions);
    const indexBuffer = ws.createBufferWithData(init.device, data.indices);
    const indexBuffer2 = ws.createBufferWithData(init.device, data.indices2);

    // uniform buffer for transform matrix
    const  uniformBuffer = ws.createBuffer(init.device, 64);

    // uniform buffer for color
    const  colorUniformBuffer = ws.createBuffer(init.device, 16);
    const  colorUniformBuffer2 = ws.createBuffer(init.device, 16);
    
    // uniform bind group
    const uniformBindGroup = ws.createBindGroup(init.device, pipeline.getBindGroupLayout(0), 
        [uniformBuffer, colorUniformBuffer]);
    const uniformBindGroup2 = ws.createBindGroup(init.device, pipeline2.getBindGroupLayout(0), 
        [uniformBuffer, colorUniformBuffer2]);

    // create depth view
    const depthTexture = ws.createDepthTexture(init);

    // create texture view for MASS (count = 4)
    const msaaTexture = ws.createMultiSampleTexture(init);
    
    return {
        pipelines: [pipeline, pipeline2],
        vertexBuffers: [vertexBuffer, indexBuffer, indexBuffer2],
        uniformBuffers: [uniformBuffer, colorUniformBuffer, colorUniformBuffer2],
        uniformBindGroups: [uniformBindGroup, uniformBindGroup2],
        depthTextures: [depthTexture],
        gpuTextures: [msaaTexture],
    };
}
    
export const draw = (init:ws.IWebGPUInit, p:ws.IPipeline, plotType:string, data:any) => {  
    const commandEncoder =  init.device.createCommandEncoder();
    const descriptor = ws.createRenderPassDescriptor({
        init,
        depthView: p.depthTextures[0].createView(),
        textureView: p.gpuTextures[0].createView(),
    });
    const renderPass = commandEncoder.beginRenderPass(descriptor);
    
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

export const updateUniformBuffers = (device:GPUDevice, p:ws.IPipeline, params:any, mvpMat:mat4) => {
    // update uniform buffers for transformation and color
    device.queue.writeBuffer(p.uniformBuffers[0], 0, mvpMat as ArrayBuffer);  
    device.queue.writeBuffer(p.uniformBuffers[1], 0, ws.hex2rgb(params.objectColor));  
    device.queue.writeBuffer(p.uniformBuffers[2], 0, ws.hex2rgb(params.wireframeColor)); 
}

export const updateVertexBuffers = (device:GPUDevice, p:ws.IPipeline, data:any, origNumVertices:number) => {
    const pData = [data.positions, data.indices, data.indices2];
    ws.updateVertexBuffers(device, p, pData, origNumVertices);
}