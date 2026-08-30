import { useContext, useRef } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { Color, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { useFrame } from "@react-three/fiber";
import { randFloatSpread } from "three/src/math/MathUtils.js";

type ParticleMeshProps = {
    position: Vector3,
    particleRadius: number,
    borderLimit: number,
    speed: number
}

function ParticleMesh({ position, particleRadius, borderLimit, speed }: ParticleMeshProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;
    
    const meshRef = useRef<Mesh | null>(null!);
    const materialRef = useRef<MeshStandardMaterial | null>(null!);

    const offsetsRef = useRef<Vector3>(new Vector3(
        randFloatSpread(0.01), randFloatSpread(0.01), randFloatSpread(0.01)
    ));

    useFrame((state) => {
        const mesh = meshRef.current;
        if (mesh) {
            const time = state.clock.getElapsedTime();
            const currentPosition = mesh.position;
            const offsets = offsetsRef.current;

            if (Math.abs(currentPosition.x) > borderLimit / 2) {
                offsets.x *= -1;
            }
            if (Math.abs(currentPosition.y) > borderLimit / 2) {
                offsets.y *= -1;
            }
            if (Math.abs(currentPosition.z) > borderLimit / 2) {
                offsets.z *= -1;
            }

            const velocity = new Vector3(Math.sin(time), Math.cos(time), Math.sin(time));
            mesh.position.addScaledVector(velocity, speed).add(offsets);
        }
    });

    // const handleParticleClick = () => {
    //     const material = materialRef.current;
    //     material.color.setColorName("yellow");
    //     const timeout = setTimeout(() => {
    //         material.color.setColorName(theme === Theme.Light ? "black" : "white");
    //     }, 1000);
    //     return () => { clearTimeout(timeout); }
    // };

    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[particleRadius]}/>
            <meshStandardMaterial ref={materialRef} color={theme === Theme.Light ? Color.NAMES.black : Color.NAMES.white}/>
        </mesh>
    );
}

export default ParticleMesh;