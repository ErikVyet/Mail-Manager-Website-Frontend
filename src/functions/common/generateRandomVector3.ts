import { Vector3 } from "three";
import { randFloatSpread } from "three/src/math/MathUtils.js";

function generateRandomVector3(bound: number = 0): Vector3 {
    const x = randFloatSpread(bound);
    const y = randFloatSpread(bound);
    const z = randFloatSpread(bound);
    return new Vector3(x, y, z);
}

export { generateRandomVector3 };