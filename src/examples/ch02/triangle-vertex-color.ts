import shader from './triangle-vertex-color.wgsl';
import * as ws from 'webgpu-simplified';

const createPipeline = async (init:ws.IWebGPUInit): Promise<ws.IPipeline> => {
    const descriptor = ws.createRenderPipelineDescriptor({
        init,  
        shader,
        isDepthStencil: false,
    });
    const pipeline = await init.device.createRenderPipelineAsync(descriptor);
    
    return {pipelines: [pipeline]}; 
}

const draw = (init: ws.IWebGPUInit, p: ws.IPipeline ) => {
    const commandEncoder =  init.device.createCommandEncoder();
    const descriptor = ws.createRenderPassDescriptor({init});
    const renderPass = commandEncoder.beginRenderPass(descriptor);
    renderPass.setPipeline(p.pipelines[0]);
    renderPass.draw(3);
    renderPass.end();
    init.device.queue.submit([commandEncoder.finish()]);
}

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const init = await ws.initWebGPU({canvas});
    const p = await createPipeline(init);
    draw(init, p);
}

run();