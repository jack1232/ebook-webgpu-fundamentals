import { vec2, vec3 } from 'gl-matrix';
import * as mf from './math-func';
const pi = 3.141592653589793;

export const getTorusData = (rlarge:number, rsmall:number, u:number, v:number) => {
    if(u < 2 || v < 2) return;
    let pts = [];
    let normals = [];
    let eps = 0.01 * 2*pi/v;
    let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
    for(let i = 0; i <= u; i++){
        let du = i*2*pi/u;
        for(let j = 0; j <= v; j++){
            let dv = j*2*pi/v;
            p0 = mf.getTorusPosition(rlarge, rsmall, du, dv);
            pts.push(p0[0], p0[1], p0[2]);

            // calculate normals
            if(du-eps >= 0) {
                p1 = mf.getTorusPosition(rlarge, rsmall, du-eps, dv);
                p2 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = mf.getTorusPosition(rlarge, rsmall, du+eps, dv);
                p2 = vec3.subtract(vec3.create(), p1, p0);
            }
            if(dv-eps >= 0) {
                p1 = mf.getTorusPosition(rlarge, rsmall, du, dv-eps);
                p3 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = mf.getTorusPosition(rlarge, rsmall, du, dv+eps);
                p3 = vec3.subtract(vec3.create(), p1, p0);
            }
            let normal = vec3.cross(vec3.create(), p3, p2);
            vec3.normalize(normal, normal);
            normals.push(normal[0], normal[1], normal[2]);
        }
    }

    let n_vertices_per_row = v + 1;
    let indices = [];
    let indices2 = [];

    for(let i = 0; i < u; i++){
        for(let j = 0; j < v; j++) {
            let idx0 = j + i * n_vertices_per_row;
            let idx1 = j + 1 + i * n_vertices_per_row;
            let idx2 = j + 1 + (i + 1) * n_vertices_per_row;
            let idx3 = j + (i + 1) * n_vertices_per_row; 

            indices.push(idx0, idx1, idx2, idx2, idx3, idx0);          
            indices2.push(idx0, idx1, idx0, idx3);      
        }
    }
    return {
        positions: new Float32Array(pts),
        normals: new Float32Array(normals),
        indices: new Uint32Array(indices),
        indices2: new Uint32Array(indices2),
    };
}

export const getCylinderData = (rin:number, rout:number, height:number, n:number) => {
    if(n < 2)  throw new Error('n must be greater than 2.');
    if( rin >= 0.999*rout)  rin = 0.999*rout;

    let pts = [];
    let p = [];
    let h = height / 2;

    for(let i = 0; i <= n; i++){
        p[0] = mf.getCylinderPosition(rout,i*2*pi/n, h);
        p[1] = mf.getCylinderPosition(rout,i*2*pi/n, -h);
        p[2] = mf.getCylinderPosition(rin,i*2*pi/n, -h);
        p[3] = mf.getCylinderPosition(rin,i*2*pi/n, h);
        pts.push(
            p[0][0], p[0][1], p[0][2],
            p[1][0], p[1][1], p[1][2],
            p[2][0], p[2][1], p[2][2],
            p[3][0], p[3][1], p[3][2],
        );
    }

    let indices = [], indices2 = [];
    for(let i = 0; i < n; i++){
        let idx0 = i*4;
        let idx1 = i*4 + 1;
        let idx2 = i*4 + 2;
        let idx3 = i*4 + 3;
        let idx4 = i*4 + 4;
        let idx5 = i*4 + 5;
        let idx6 = i*4 + 6;
        let idx7 = i*4 + 7;

        // triangle indices 
        indices.push(idx0, idx4, idx7, idx7, idx3, idx0); // top
        indices.push(idx1, idx2, idx6, idx6, idx5, idx1); // bottom
        indices.push(idx0, idx1, idx5, idx5, idx4, idx0); // outer
        indices.push(idx2, idx3, idx7, idx7, idx6, idx2); // inner

        // wireframe indices 
        indices2.push(idx0, idx3, idx3, idx7, idx4, idx0); // top
        indices2.push(idx1, idx2, idx2, idx6, idx5, idx1); // bottom
        indices2.push(idx0, idx1, idx3, idx2); // side
    }

    return {
        positions: new Float32Array(pts),
        indices: new Uint32Array(indices),
        indices2: new Uint32Array(indices2),
    }
}

export const getSphereData = (radius:number, u:number, v:number) => {
    if(u < 2 || v < 2) return;
    let pts = [], normals = [], uvs = [];
    for(let i = 0; i <= u; i++){
        for(let j = 0; j <= v; j++){
            let pt = mf.getSpherePosition(radius, i*pi/u, j*2*pi/v);
            pts.push(pt[0], pt[1], pt[2]);
            normals.push(pt[0]/radius, pt[1]/radius, pt[2]/radius);
            uvs.push(i/u, j/v);
        }
    }

    let n_vertices_per_row = v + 1;
    let indices = [];
    let indices2 = [];

    for(let i = 0; i < u; i++){
        for(let j = 0; j < v; j++) {
            let idx0 = j + i * n_vertices_per_row;
            let idx1 = j + 1 + i * n_vertices_per_row;
            let idx2 = j + 1 + (i + 1) * n_vertices_per_row;
            let idx3 = j + (i + 1) * n_vertices_per_row; 

            indices.push(idx0, idx1, idx2, idx2, idx3, idx0);          
            indices2.push(idx0, idx1, idx0, idx3);      
        }
    }
    return {
        positions: new Float32Array(pts),
        normals: new Float32Array(normals),
        uvs: new Float32Array(uvs),
        indices: new Uint32Array(indices),
        indices2: new Uint32Array(indices2),
    };
}


export const getCubeData = (side = 2, uLength = 1, vLength = 1) => {
    let s2 = side / 2;
    let positions = new Float32Array([
        s2,  s2,  s2,   // index 0
        s2,  s2, -s2,   // index 1
        s2, -s2,  s2,   // index 2
        s2, -s2, -s2,   // index 3
       -s2,  s2, -s2,   // index 4
       -s2,  s2,  s2,   // index 5
       -s2, -s2, -s2,   // index 6
       -s2, -s2,  s2,   // index 7
       -s2,  s2, -s2,   // index 8
        s2,  s2, -s2,   // index 9
       -s2,  s2,  s2,   // index 10
        s2,  s2,  s2,   // index 11
       -s2, -s2,  s2,   // index 12
        s2, -s2,  s2,   // index 13
       -s2, -s2, -s2,   // index 14
        s2, -s2, -s2,   // index 15
       -s2,  s2,  s2,   // index 16
        s2,  s2,  s2,   // index 17
       -s2, -s2,  s2,   // index 18
        s2, -s2,  s2,   // index 19
        s2,  s2, -s2,   // index 20
       -s2,  s2, -s2,   // index 21
        s2, -s2, -s2,   // index 22
       -s2, -s2, -s2,   // index 23
    ]); 

    let colors = new Float32Array([
        1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 0,
        0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
        0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1,
        0, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0,
        0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1,
        1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0
    ]);

    let normals = new Float32Array([
        1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,
       -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0,
        0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,  0,
        0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,  0,
        0,  0,  1,  0,  0,  1,  0,  0,  1,  0,  0,  1,
        0,  0, -1,  0,  0, -1,  0,  0, -1,  0,  0, -1,
    ]);

    let u = uLength;
    let v = vLength;
    let uvs = new Float32Array([
        0, v, u, v, 0, 0, u, 0, 0, v, u, v, 0, 0, u, 0, 
        0, v, u, v, 0, 0, u, 0, 0, v, u, v, 0, 0, u, 0, 
        0, v, u, v, 0, 0, u, 0, 0, v, u, v, 0, 0, u, 0, 
    ]);

    let indices = new Uint32Array([     // triangle indices
         0,  2,  1,
         2,  3,  1,
         4,  6,  5,
         6,  7,  5,
         8, 10,  9,
        10, 11,  9,
        12, 14, 13,
        14, 15, 13,
        16, 18, 17,
        18, 19, 17,
        20, 22, 21,
        22, 23, 21,
    ]);

    let indices2 = new Uint32Array([    // wireframe indices
        8, 9, 9, 11, 11, 10, 10, 8,     // top
        14, 15, 15, 13, 13, 12, 12, 14, // bottom
        11, 13, 9, 15, 8, 14, 10, 12,   // side
    ])
    
    return {positions, colors, normals, uvs, indices, indices2};
}