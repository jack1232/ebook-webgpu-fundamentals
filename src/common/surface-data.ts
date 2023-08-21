import { vec3 } from 'gl-matrix';
import * as mf from './math-func';
import { addColors, colormapData } from './colormap-data';

const pi = 3.1415926;

// #region Parametric Surface *************************************************************************
export const getParametricSurfaceData = (s:ISurfaceInput): ISurfaceOutput => {
    s.surfaceType = s.surfaceType.toLowerCase();
    if(s.surfaceType === 'astroid'){
        s.umin = 0, s.umax = 2*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.astroid, s);
    } else if(s.surfaceType === 'astroid2'){
        s.umin = 0, s.umax = 2*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.astroid2, s);
    } else if(s.surfaceType === 'astroidaltorus'){
        s.umin = -pi, s.umax = pi, s.vmin = 0, s.vmax = 5;
        return parametricSurfaceData(mf.astroidalTorus, s);
    } else if(s.surfaceType === 'bohemiandome'){
        s.umin = 0, s.umax = 2*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.bohemianDome, s);
    } else if(s.surfaceType === 'boyshape'){
        s.umin = 0, s.umax = pi, s.vmin = 0, s.vmax = pi;
        return parametricSurfaceData(mf.boyShape, s);
    } else if(s.surfaceType === 'enneper'){
        s.umin = -3.3, s.umax = 3.3, s.vmin = -3.3, s.vmax = 3.3;
        return parametricSurfaceData(mf.enneper, s);
    } else if(s.surfaceType === 'henneberg'){
        s.umin = 0, s.umax = 1, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.henneberg, s);
    } else if(s.surfaceType === 'kiss'){
        s.umin = -0.99999, s.umax = 0.99999, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.kiss, s);
    } else if(s.surfaceType === 'kuen'){
        s.umin = -4.5, s.umax = 4.5, s.vmin = -5, s.vmax = 5;
        return parametricSurfaceData(mf.kuen, s);
    } else if(s.surfaceType === 'minimal'){
        s.umin = -3, s.umax = 1, s.vmin = -3*pi, s.vmax = 3*pi;
        return parametricSurfaceData(mf.minimal, s);
    } else if(s.surfaceType === 'paraboliccyclide'){
        s.umin = -5, s.umax = 5, s.vmin = -5, s.vmax = 5;
        return parametricSurfaceData(mf.parabolicCyclide, s);
    } else if(s.surfaceType === 'pear'){
        s.umin = 0, s.umax = 1, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.pear, s);
    } else if(s.surfaceType === 'pluckerconoid'){
        s.umin = -2, s.umax = 2, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.pluckerConoid, s);
    } else if(s.surfaceType === 'steiner'){
        s.umin = 0, s.umax = 1.999999*pi, s.vmin = 0, s.vmax = 0.999999*pi;
        return parametricSurfaceData(mf.steiner, s);
    } else if(s.surfaceType === 'torus'){
        s.umin = 0, s.umax = 2*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.torus, s);
    } else if(s.surfaceType === 'seashell'){
        s.umin = 0, s.umax = 6*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.seashell, s);
    } else if(s.surfaceType === 'breather'){
        s.umin = -14, s.umax = 14, s.vmin = -12*pi, s.vmax = 12*pi;
        return parametricSurfaceData(mf.breather, s);
    } else if(s.surfaceType === 'sievertenneper'){
        s.umin = -pi/2.1, s.umax = pi/2.1, s.vmin = 0.001, s.vmax = pi/1.001;
        return parametricSurfaceData(mf.sievertEnneper, s);
    } else if(s.surfaceType === 'kleinbottle2'){
        s.umin = 0, s.umax = 2*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.kleinBottle2, s);
    } else if(s.surfaceType === 'kleinbottle3'){
        s.umin = 0, s.umax = 4*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.kleinBottle3, s);
    } else if(s.surfaceType === 'figure8'){
        s.umin = 0, s.umax = 4*pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.figure8, s);
    } else if(s.surfaceType === 'wellenkugel'){
        s.umin = 0, s.umax = 14.5, s.vmin = 0, s.vmax = 5.2;
        return parametricSurfaceData(mf.wellenkugel, s);
    } else {
        s.umin = 0, s.umax = pi, s.vmin = 0, s.vmax = 2*pi;
        return parametricSurfaceData(mf.kleinBottle, s);
    }
}

export const parametricSurfaceData = (f:any, s:ISurfaceInput): ISurfaceOutput => {
    // define default values for input parameters:
    s.colormapName = s.colormapName === undefined? 'jet': s.colormapName;
    s.wireframeColor = s.wireframeColor === undefined? 'white': s.wireframeColor;
    s.colormapDirection = s.colormapDirection === undefined? 1: s.colormapDirection;
    s.uLength = s.uLength === undefined? 1: s.uLength;
    s.vLength = s.vLength === undefined? 1: s.vLength;

    if(s.nu<2 || s.nv<2) return;

    let positions = [], normals = [], colors = [], colors2 = [], uvs = [];
    const du = (s.umax-s.umin)/s.nu, dv = (s.vmax-s.vmin)/s.nv;
    let epsu = 0.01*du, epsv = 0.01*dv;
    let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
    let u:number, v: number;

    let {min, max, pts} = parametricSurfaceRange(f, s);
    const cdata = colormapData(s.colormapName);
    const cdata2 = colormapData(s.wireframeColor);

    for(let i = 0; i <= s.nu; i++){
        u = s.umin + i*du;
        for(let j = 0; j <= s.nv; j++ ){
            v = s.vmin + j*dv;           
            positions.push(pts[i][j][0], pts[i][j][1], pts[i][j][2]);

            // normals
            p0 = f(u, v);
            if(u - epsu >= 0){
                p1 = f(u - epsu, v);
                p2 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = f(u + epsu, v);;
                p2 = vec3.subtract(vec3.create(), p1, p0);
            }
            if(v - epsv >= 0) {
                p1 = f(u, v - epsv);
                p3 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = f(u, v + epsv);
                p3 = vec3.subtract(vec3.create(), p1, p0);
            }
            let normal = vec3.cross(vec3.create(), p3, p2);
            vec3.normalize(normal, normal);
            normals.push(normal[0], normal[1], normal[2]);

            // colormap
            let color = addColors(cdata, min, max, pts[i][j][s.colormapDirection]);
            let col = addColors(cdata2, min, max, pts[i][j][s.colormapDirection]);
            colors.push(color[0], color[1], color[2]);
            colors2.push(col[0], col[1], col[2]);
            uvs.push( s.uLength * (u-s.umin)/(s.umax-s.umin), s.vLength * (v-s.vmin)/(s.vmax-s.vmin));
        }
    }

    // calculate indices
    let n_vertices_per_row = s.nv + 1;
    let indices = [];
    let indices2 = []; // for wireframe

    for(let i = 0; i < s.nu; i++){
        for(let j = 0; j < s.nv; j++) {
            let idx0 = j + i * n_vertices_per_row;
            let idx1 = j + 1 + i * n_vertices_per_row;
            let idx2 = j + 1 + (i + 1) * n_vertices_per_row;
            let idx3 = j + (i + 1) * n_vertices_per_row; 

            indices.push(idx0, idx1, idx2, idx2, idx3, idx0);          
            indices2.push(idx0, idx1, idx0, idx3);      
            if(i === s.nu - 1 || j === s.nv - 1) 
            {
                indices2.push(idx1, idx2);
                indices2.push(idx2, idx3);
            }
        }
    }

    return {
        positions: new Float32Array(positions.flat()),
        normals: new Float32Array(normals.flat()),
        colors: new Float32Array(colors.flat()),
        colors2: new Float32Array(colors2.flat()),
        uvs: new Float32Array(uvs.flat()),
        indices: new Uint32Array(indices),
        indices2: new Uint32Array(indices2),
    };
}

const parametricSurfaceRange = (f:any, s:ISurfaceInput) => {
    const du = (s.umax-s.umin)/s.nu, dv = (s.vmax-s.vmin)/s.nv;
    let xmin = Number.MAX_VALUE, xmax = -Number.MAX_VALUE;
    let ymin = Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
    let zmin = Number.MAX_VALUE, zmax = -Number.MAX_VALUE;
    let min = Number.MAX_VALUE, max = -Number.MAX_VALUE;

    let pts = [];
    for(let i = 0; i <= s.nu; i++){
        let u = s.umin + i*du;
        let pt1: vec3[] = [];
        for(let j = 0; j <= s.nv; j++){
            let v = s.vmin + j*dv;
            let pt = f(u, v);
            xmin = pt[0] < xmin? pt[0] : xmin;
            xmax = pt[0] > xmax? pt[0] : xmax;
            ymin = pt[1] < ymin? pt[1] : ymin;
            ymax = pt[1] > ymax? pt[1] : ymax;
            zmin = pt[2] < zmin? pt[2] : zmin;
            zmax = pt[2] > zmax? pt[2] : zmax;
            pt1.push(pt);
        }
        pts.push(pt1);
    }

    let distance = Math.max(xmax - xmin, ymax - ymin, zmax - zmin);
    let pt:vec3;
    for(let i = 0; i <= s.nu; i++){
        let u = s.umin + i*du;      
        for(let j = 0; j <= s.nv; j++){
            let v = s.vmin + j*dv;
            pt = pts[i][j];
            pt[0] = s.scale * (pt[0] - 0.5 *(xmin + xmax)) / distance;
            pt[1] = s.scale * (pt[1] - 0.5 *(ymin + ymax)) / distance;
            pt[2] = s.scale * (pt[2] - 0.5 *(zmin + zmax)) / distance;
            min = pt[s.colormapDirection] < min? pt[s.colormapDirection] : min;
            max = pt[s.colormapDirection] > max? pt[s.colormapDirection] : max;
            pts[i][j] = pt;
        }
    }
    return { min, max, pts };
}

// #endregion Parametric Surface **********************************************************************


// #region Simple Surface *****************************************************************************
export interface ISurfaceInput{
    surfaceType?: string,
    umin?: number,
    umax?: number,
    vmin?: number,
    vmax?: number,
    nu?: number,
    nv?: number, 
    scale?: number,
    aspect?: number,
    colormapName?: string,
    wireframeColor?: string,
    colormapDirection?: number, // 0: x-direction, 1: y-direction, 2: z-direction
    t?: number, // animation time parameter
    uLength?: number,
    vLength?: number,
}

export interface ISurfaceOutput {
    positions?: Float32Array,
    normals?: Float32Array,
    colors?: Float32Array,
    colors2?: Float32Array,
    uvs?: Float32Array,
    indices?: Uint32Array,
    indices2?: Uint32Array,
}

export const getSimpleSurfaceData = (s:ISurfaceInput): ISurfaceOutput => {
    if(s.surfaceType === 'sinc'){
        s.umin = -8, s.umax = 8; s.vmin = -8, s.vmax = 8, s.aspect = 0.5;
        return simpleSurfaceData(mf.sinc, s);
    } else if (s.surfaceType === 'poles'){
        s.umin = -8, s.umax = 8; s.vmin = -8, s.vmax = 8, s.aspect = 0.6;
        return simpleSurfaceData(mf.poles, s);
    } else {
        s.umin = -3, s.umax = 3; s.vmin = -3, s.vmax = 3, s.aspect = 0.9;
        return simpleSurfaceData(mf.peaks, s);
    }    
}

export const simpleSurfaceData = (f:any, s:ISurfaceInput): ISurfaceOutput => {
     // define default values for input parameters:
     s.colormapName = s.colormapName === undefined? 'jet': s.colormapName;
     s.wireframeColor = s.wireframeColor === undefined? 'white': s.wireframeColor;
     s.colormapDirection = s.colormapDirection === undefined? 1: s.colormapDirection;
     s.uLength = s.uLength === undefined? 1: s.uLength;
     s.vLength = s.vLength === undefined? 1: s.vLength;

    if(s.nu<2 || s.nv<2) return;

    let positions = [], normals = [], colors = [], colors2 = [], uvs = [];
    const dx = (s.umax-s.umin)/s.nu, dz = (s.vmax-s.vmin)/s.nv;
    let epsx = 0.01*dx, epsz = 0.01*dz;
    let p0:vec3, p1:vec3, p2:vec3, p3:vec3;
    let x:number, z: number;

    let {ymin, ymax} = simpleSurfaceRange(f, s);
    
    const cdata = colormapData(s.colormapName);
    const cdata2 = colormapData(s.wireframeColor);

    for(let i = 0; i <= s.nu; i++){
        x = s.umin + i*dx;
        for(let j = 0; j <= s.nv; j++ ){
            z = s.vmin + j*dz;
            p0 = normalizeData(f(x, z, s.t), ymin, ymax, s);
            positions.push(p0[0], p0[1], p0[2]);

            // normals
            if(x - epsx >= 0){
                p1 = normalizeData(f(x-epsx, z, s.t), ymin, ymax, s);
                p2 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = normalizeData(f(x+epsx, z, s.t), ymin, ymax, s);
                p2 = vec3.subtract(vec3.create(), p1, p0);
            }
            if(z - epsz >= 0) {
                p1 = normalizeData(f(x, z-epsz, s.t), ymin, ymax, s);
                p3 = vec3.subtract(vec3.create(), p0, p1);
            } else {
                p1 = normalizeData(f(x, z+epsz, s.t), ymin, ymax, s);
                p3 = vec3.subtract(vec3.create(), p1, p0);
            }
            let normal = vec3.cross(vec3.create(), p3, p2);
            vec3.normalize(normal, normal);
            normals.push(normal[0], normal[1], normal[2]);

            // colormap
            let range = (s.colormapDirection === 1)? s.scale*s.aspect : s.scale;
            let color = addColors(cdata, -range, range, p0[s.colormapDirection]);
            let col = addColors(cdata2, -range, range, p0[s.colormapDirection]);
            colors.push(color[0], color[1], color[2]);
            colors2.push(col[0], col[1], col[2]);
            uvs.push(s.uLength*(x-s.umin)/(s.umax-s.umin), s.vLength*(z-s.vmin)/(s.vmax-s.vmin));
        }
    }

    // calculate indices
    let n_vertices_per_row = s.nv + 1;
    let indices = [];
    let indices2 = []; // for wireframe

    for(let i = 0; i < s.nu; i++){
        for(let j = 0; j < s.nv; j++) {
            let idx0 = j + i * n_vertices_per_row;
            let idx1 = j + 1 + i * n_vertices_per_row;
            let idx2 = j + 1 + (i + 1) * n_vertices_per_row;
            let idx3 = j + (i + 1) * n_vertices_per_row; 

            indices.push(idx0, idx1, idx2, idx2, idx3, idx0);          
            indices2.push(idx0, idx1, idx0, idx3);  
            if(i === s.nu - 1 || j === s.nv - 1) 
            {
                indices2.push(idx1, idx2);
                indices2.push(idx2, idx3);
            }    
        }
    }

    return {
        positions: new Float32Array(positions.flat()),
        normals: new Float32Array(normals.flat()),
        colors: new Float32Array(colors.flat()),
        colors2: new Float32Array(colors2.flat()),
        uvs: new Float32Array(uvs.flat()),
        indices: new Uint32Array(indices),
        indices2: new Uint32Array(indices2),
    };
}

const simpleSurfaceRange = (f:any, s:ISurfaceInput) => {
    const dx = (s.umax-s.umin)/s.nu, dz = (s.vmax-s.vmin)/s.nv;
    let ymin = Number.MAX_VALUE, ymax = -Number.MAX_VALUE;
    
    for(let i = 0; i <= s.nu; i++){
        let x = s.umin + i*dx;
        for(let j = 0; j<= s.nv; j++){
            let z = s.vmin + j*dz;
            let pt = f(x, z, s.t);
            ymin = pt[1] < ymin? pt[1] : ymin;
            ymax = pt[1] > ymax? pt[1] : ymax;
        }
    }
    return { ymin, ymax};
}

const normalizeData = (pt:vec3, ymin:number, ymax:number, s:ISurfaceInput) => {
    pt[0] = (-1 + 2 * (pt[0] - s.umin) / (s.umax - s.umin)) * s.scale;
    pt[1] = (-1 + 2 * (pt[1] - ymin) / (ymax - ymin)) * s.scale * s.aspect;
    pt[2] = (-1 + 2 * (pt[2] - s.vmin) / (s.vmax - s.vmin)) * s.scale;
    return pt;
}

// #endregion Simple Surface **************************************************************************