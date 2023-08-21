import shader from './triangle-gpu-buffer.wgsl';
import * as ws from 'webgpu-simplified';

const vertexData = new Float32Array([
    0.0, 0.5, 
    -0.5, -0.5,
    0.5, -0.5,
]);

const createPipeline = async (init: ws.IWebGPUInit): Promise<ws.IPipeline> => {
    const descriptor = ws.createRenderPipelineDescriptor({
        init, shader,
        isDepthStencil: false,
        buffers: ws.setVertexBuffers(['float32x2']), 
    });
    const pipeline = await init.device.createRenderPipelineAsync(descriptor);
   
    const vertexBuffer = ws.createBufferWithData(init.device, vertexData);
    const colorData = new Float32Array([1,0,0,1]);
    const uniformBuffer = ws.createBufferWithData(init.device, colorData, ws.BufferType.Uniform);
    const uniformBindGroup = ws.createBindGroup(init.device, pipeline.getBindGroupLayout(0), [uniformBuffer]);

    return {
        pipelines: [pipeline],
        vertexBuffers: [vertexBuffer],
        uniformBuffers: [uniformBuffer],
        uniformBindGroups: [uniformBindGroup],
    };
}

const draw = (init: ws.IWebGPUInit, p: ws.IPipeline ) => {
    const commandEncoder =  init.device.createCommandEncoder();
    const descriptor = ws.createRenderPassDescriptor({init});
    const renderPass = commandEncoder.beginRenderPass(descriptor);
    renderPass.setPipeline(p.pipelines[0]);
    renderPass.setVertexBuffer(0, p.vertexBuffers[0]);
    renderPass.setBindGroup(0, p.uniformBindGroups[0]);
    renderPass.draw(3);
    renderPass.end();
    init.device.queue.submit([commandEncoder.finish()]);
}

const run = async () => {
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    const init = await ws.initWebGPU({canvas});
    const p = await createPipeline(init);

    var gui = ws.getDatGui();
    const params = {
        color: '#ff0000',
    };
    gui.addColor(params, 'color').onChange((color:string) => {
        init.device.queue.writeBuffer(p.uniformBuffers[0], 0, ws.hex2rgb(color));
        draw(init, p);
    });
    
    draw(init, p);
}

run();