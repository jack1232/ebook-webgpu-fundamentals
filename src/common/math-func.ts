import { vec3 } from 'gl-matrix';

export const getTorusPosition = (R:number, r:number, u:number, v:number) => {
    let x = (R + r*cos(v)) * cos(u);
    let y = r * sin(v);
    let z = -(R + r*cos(v)) * sin(u);
    return vec3.fromValues(x, y, z);       
}

export const getCylinderPosition = (radius:number, theta:number, y:number) => {
    let x = radius * cos(theta);
    let z = -radius * sin(theta);
    return vec3.fromValues(x, y, z);
}

export const getSpherePosition = (radius:number, theta:number, phi:number): vec3 => {
    // note theta, phi must in radians
    let x = radius * sin(theta) * cos(phi);
    let y = radius * cos(theta);
    let z = -radius * sin(theta) * sin(phi);    
    return vec3.fromValues(x, y, z);     
}


// utility
const abs = (x:number) => Math.abs(x);
const sin = (x:number) => Math.sin(x);
const tan = (x:number) => Math.tan(x);
const atan = (x:number) => Math.atan(x);
const cos = (x:number) => Math.cos(x);
const exp = (x:number) => Math.exp(x);
const sqrt = (x:number) => Math.sqrt(x);
const sinh = (x:number) => Math.sinh(x);
const cosh = (x:number) => Math.cosh(x);
const log = (x:number) => Math.log(x);
const pow = (x:number, y:number) => Math.pow(x, y);
const p2 = (x:number) => Math.pow(x, 2);
const p3 = (x:number) => x>=0? Math.pow(x, 3): -Math.pow(-x, 3);
const p4 = (x:number) => Math.pow(x, 4);
const p5 = (x:number) => x>=0? Math.pow(x, 5): -Math.pow(-x, 5);
const p6 = (x:number) => Math.pow(x, 6);
const p7 = (x:number) => x>=0? Math.pow(x, 7): -Math.pow(-x, 7);
const p8 = (x:number) => Math.pow(x, 8);