import shader from './triangle-primitive.wgsl';
import * as ws from 'webgpu-simplified';

const createPipeline = async (init:ws.IWebGPUInit, primitiveType: GPUPrimitiveTopology): 
Promise<ws.IPipeline> => {
    const descriptor = ws.createRenderPipelineDescriptor({
        init, primitiveType, shader,
        isDepthStencil: false,
    });
    const pipeline = await init.device.createRenderPipelineAsync(descriptor);
   
    return { pipelines: [pipeline] };
}

const draw = (init: ws.IWebGPUInit, p: ws.IPipeline ) => {    
    const commandEncoder =  init.device.createCommandEncoder();
    const descriptor = ws.createRenderPassDescriptor({init});
    const renderPass = commandEncoder.beginRenderPass(descriptor);
        
    renderPass.setPipeline(p.pipelines[0]);
    renderPass.draw(9);
    renderPass.end();
    init.device.queue.submit([commandEncoder.finish()]); 
}

const run = async () => {    
    var gui = ws.getDatGui();
    const params = {
        primitive_type: 'triangle-list',
    }
    var mygui = gui.add(params, 'primitive_type', ['triangle-list', 'triangle-strip']);
    const canvas = document.getElementById('canvas-webgpu') as HTMLCanvasElement;
    
    const init = await ws.initWebGPU({canvas});
    const p = await createPipeline(init, 'triangle-list');
    draw(init, p);

    // change primitive type
    mygui.onChange((primitive_type: GPUPrimitiveTopology) => {
        let p1 = createPipeline(init, primitive_type);
        p1.then((result) => {
            draw(init, result);
        });
    });
}

run();