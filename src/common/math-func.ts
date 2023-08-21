import { vec3 } from 'gl-matrix';
const pi = 3.1415926;

export const figure8 = (u:number, v:number, a=2.5) => {
    var x = (a + cos(0.5 * u) * sin(v) - sin(0.5 * u) * sin(2 * v)) * cos(u);
    var y = (a + cos(0.5 * u) * sin(v) - sin(0.5 * u) * sin(2 * v)) * sin(u);
    var z = sin(0.5 * u) * sin(v) + cos(0.5 * u) * sin(2 * v);
    return vec3.fromValues(x, y, z);
}

export const kleinBottle3 = (u:number, v:number, a=8, n=3, m=1) => {
    var x = (a + cos(0.5 * u * n) * sin(v) - sin(0.5 * u * n) * sin(2 * v)) * cos(0.5 * u * m);
    var y = sin(0.5 * u * n) * sin(v) + cos(0.5 * u * n) * sin(2 * v);
    var z = (a + cos(0.5 * u * n) * sin(v) - sin(0.5 * u * n) * sin(2 * v)) * sin(0.5 * u * m);
    return vec3.fromValues(x, y, z);
}

export const kleinBottle2 = (u:number, v:number, a=1) => {
    var x = 0, z = 0;
    var r = 4 * (1 - 0.5 * cos(u))*a;
    if (u >= 0 && u <= pi)
    {
        x = 6 * cos(u) * (1 + sin(u)) + r * cos(u) * cos(v);
        z = 16 * sin(u) + r * sin(u*a) * cos(v);
    }
    else if (u > pi && u <= 2 * pi)
    {
        x = 6 * cos(u) * (1 + sin(u)) + r * cos(v + pi);
        z = 16 * sin(u);
    }
    var y = r * sin(v);
    return vec3.fromValues(x, y, z);
}

export const kleinBottle = (u:number, v:number, a=1) => {
    var x = 2 / 15 * (3 + 5 * cos(u) * sin(u)) * sin(v);
    var y = -1 / 15 * sin(a*u) * (3 * cos(v) - 3 * p2(cos(u)) * cos(v) - 48 * p4(cos(u)) * cos(v) + 48 * p6(cos(u)) * cos(v) -
        60 * sin(u) + 5 * cos(u) * cos(v) * sin(u) - 5 * p3(cos(u)) * cos(v) * sin(u) -
        80 * p5(cos(u)) * cos(v) * sin(u) + 80 * p7(cos(u)) * cos(v) * sin(u));
    var z = -2 / 15 * cos(u) * (3 * cos(v) - 30 * sin(u) + 90 * p4(cos(u)) * sin(u) - 60 * p6(cos(u)) * sin(u) +
        5 * cos(u) * cos(v) * sin(u));
    return vec3.fromValues(x, y, z);
}

export const wellenkugel = (u:number, v:number) => {
    var x = u * cos(cos(u)) * sin(v);
    var y = u * sin(cos(u));
    var z = u * cos(cos(u)) * cos(v);
    return vec3.fromValues(x, y, z);
}

export const seashell = (u:number, v:number) => {
    var x = 2 * (-1 + exp(u / (6 * pi))) * sin(u) * p2(cos(v / 2));
    var y = 1 - exp(u / (3 * pi)) - sin(v) + exp(u / (6 * pi)) * sin(v);
    var z = 2 * (1 - exp(u / (6 * pi))) * cos(u) * p2(cos(v / 2));
    return vec3.fromValues(x, y, z);
}

export const sievertEnneper = (u:number, v:number, a=1) => {
    var x = log(tan(v / 2)) / sqrt(a) + 2 * (1 + a) * cos(v) / (1 + a - a * sin(v) * sin(v) * cos(u) * cos(u)) / sqrt(a);
    var y = (2 * sin(v) * sqrt((1 + 1 / a) * (1 + a * sin(u) * sin(u)))) / (1 + a - a * sin(v) * sin(v) * cos(u) *
            cos(u)) * sin(atan(sqrt(1 + a) * tan(u)) - u / sqrt(1 + a));
    var z = (2 * sin(v) * sqrt((1 + 1 / a) * (1 + a * sin(u) * sin(u)))) / (1 + a - a * sin(v) * sin(v) * cos(u) *
            cos(u)) * cos(atan(sqrt(1 + a) * tan(u)) - u / sqrt(1 + a));
    return vec3.fromValues(x, y, z);
}

export const breather = (u:number, v:number, a=0.4) => {
    var ch = cosh(a * u);
    var sh = sinh(a * u);
    var x = -u + (2 * (1 - a * a) * ch * sh) / (a * ((1 - a * a) * p2(ch) + a * a * p2(sin(sqrt(1 - a * a) * v))));
    var y = (2 * sqrt(1 - a * a) * ch * (-(sqrt(1 - a * a) * cos(v) * cos(sqrt(1 - a * a) * v)) -
            sin(v) * sin(sqrt(1 - a * a) * v))) / (a * ((1 - a * a) * p2(ch) + a * a * p2(sin(sqrt(1 - a * a) * v))));
    var z = (2 * sqrt(1 - a * a) * ch * (-(sqrt(1 - a * a) * sin(v) * cos(sqrt(1 - a * a) * v)) +
            cos(v) * sin(sqrt(1 - a * a) * v))) / (a * ((1 - a * a) * p2(ch) + a * a * p2(sin(sqrt(1 - a * a) * v))));
    return vec3.fromValues(x, y, z);
}

export const torus = (u:number, v:number, R=1, r=0.3, a=1) => {
    var x = (R + r * cos(v*a)) * cos(u*a);
    var y = r * sin(v*a);
    var z = (R + r * cos(v*a)) * sin(u*a);
    return vec3.fromValues(x, y, z);
}

export const astroid = (u:number, v:number, a=1.5, b=1.5, c=1.5) => {
    var x = a * p3(cos(u)) * p3(cos(v));
    var y = c * p3(sin(v));
    var z = b * p3(sin(u)) * p3(cos(v));
    return vec3.fromValues(x, y, z);
}

export const astroid2 = (u:number, v:number, a=1, b=1, c=1) => {
    var x = a * p3(sin(u)) * cos(v);
    var y = c * p3(cos(u));
    var z = b * p3(sin(u)) * sin(v);
    return vec3.fromValues(x, y, z);
}

export const astroidalTorus = (u:number, v:number, a=2, b=1, c=7854) => {
    var x = (a + b * pow(cos(u), 3) * cos(c) - b * pow(sin(u), 3) * sin(c)) * cos(v);
    var y = b * pow(cos(u), 3) * sin(c) + b * pow(sin(u), 3) * cos(c);
    var z = (a + b * pow(cos(u), 3) * cos(c) - b * pow(sin(u), 3) * sin(c)) * sin(v);
    return vec3.fromValues(x, y, z);
}

export const bohemianDome = (u:number, v:number, a=0.7, b=1) => {
    var x = a * cos(u);
    var y = b * cos(v);
    var z = a * sin(u) + b * sin(v);
    return vec3.fromValues(x, y, z);
}

export const boyShape = (u:number, v:number) => {
    var x = cos(u) * (1 / 3 * sqrt(2) * cos(u) * cos(2 * v) + 2 / 3 * sin(u) * cos(v)) / (1 - sqrt(2) * sin(u) * cos(u) * sin(3 * v));
    var y = cos(u) * cos(u) / (1 - sqrt(2) * sin(u) * cos(u) * sin(3 * v)) - 1;
    var z = cos(u) * (1 / 3 * sqrt(2) * cos(u) * sin(2 * v) - 2 / 3 * sin(u) * sin(v)) / (1 - sqrt(2) * sin(u) * cos(u) * sin(3 * v));
    return vec3.fromValues(x, y, z);
}

export const enneper = (u:number, v:number, a=0.333) => {
    var x = a * u * (1 - u * u / 3 + v * v);
    var y = a * (u * u - v * v);
    var z = a * v * (1 - v * v / 3 + u * u);
    return vec3.fromValues(x, y, z);
}

export const henneberg = (u:number, v:number, a=1, b=1, c=1) => {
    var x = a * (sinh(u) * cos(v) - sinh(3 * u) * cos(3 * v) / 3);
    var y = c * cosh(2 * u) * cos(2 * v);
    var z = b * (sinh(u) * sin(v) - sinh(3 * u) * sin(3 * v) / 3);
    return vec3.fromValues(x, y, z);
}

export const kiss = (u:number, v:number, a=1, b=1) => {
    var x = u * u * sqrt(1 - u) * cos(a * v);
    var y = u;
    var z = u * u * sqrt(1 - u) * sin(b * v);
    return vec3.fromValues(x, y, z);
}

export const kuen = (u:number, v:number) => {
    var x = 2 * cosh(v) * (cos(u) + u * sin(u)) / (p2(cosh(v)) + u * u);
    var y = v - (2 * sinh(v) * cosh(v)) / (p2(cosh(v)) + u * u);
    var z = 2 * cosh(v) * (-u * cos(u) + sin(u)) / (p2(cosh(v)) + u * u);
    return vec3.fromValues(x, y, z);
}

export const minimal = (u:number, v:number, a=1, b=1, c=1) => {
    var x = (u - exp(2 * u) * cos(2 * v*a) / 2);
    var y = 2 * exp(u) * cos(v*b);
    var z = -(v + exp(2 * u) * sin(2 * v * c) / 2);
    return vec3.fromValues(x, y, z);
}

export const parabolicCyclide = (u:number, v:number, a=1, b=0.5) => {
    var x = a * u * (v * v + b) / (1 + u * u + v * v);
    var y = (a / 2) * (2 * v * v + b * (1 - u * u - v * v)) / (1 + u * u + v * v);
    var z = a * v * (1 + u * u - b) / (1 + u * u + v * v);
    return vec3.fromValues(x, y, z);
}

export const pear = (u:number, v:number, a=1, b=1) => {
    var x = u * sqrt(u * (1 - u)) * cos(v * a);
    var y = -u;
    var z = u * sqrt(u * (1 - u)) * sin(v * b);
    return vec3.fromValues(x, y, z);
}

export const pluckerConoid = (u:number, v:number, a=2, b=3) => {
    var x = a * u * cos(v);
    var y = a * cos(b * v);
    var z = a * u * sin(v);
    return vec3.fromValues(x, y, z);
}

export  const steiner = (u:number, v:number, a=1) => {
    var x = cos(a*u) * cos(a*v) * sin(v);
    var y = cos(a*u) * sin(a*u) * p2(cos(v));
    var z = sin(a*u) * cos(a*v) * sin(v);
    return vec3.fromValues(x, y, z);
}

export const poles = (x:number, z:number, t:number) => {
    let a = 1.5 * sin(t);
    var y = x*z/(abs((x-a)*(x-a)*(x-a)) + (z- 2.0*a)*(z- 2.0*a) + 2.0);
    return vec3.fromValues(x, y, z);
}

export const peaks = (x:number, z:number, t:number) => {
    let a = 1.00001 + sin(t);
    let b = 1.00001 + sin(1.5*t);
    let c = 1.00001 + sin(2*t);    
    let y = 3.0 * (1.0 - z) * (1.0 - z) * exp(-a*(z * z) - a * (x + 1.0) * (x + 1.0)) -
		10.0 * (z / 5.0 - z * z * z - x * x * x * x * x) * exp(-b * z * z - b * x * x) 
        - 1.0 / 3.0 * exp(- c * (z + 1.0) * (z + 1.0) - c * x * x);
    return vec3.fromValues(x, y, z);
}

export const sinc = (x:number, z:number, t:number) => {
    let a = 1.01 + sin(t);
    let r = a * sqrt(x*x + z*z);
    let y = (r === 0)? 1: sin(r)/r;
    return vec3.fromValues(x, y, z);
}

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