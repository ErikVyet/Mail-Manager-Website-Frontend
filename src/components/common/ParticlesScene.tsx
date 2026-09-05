import { useContext, useMemo } from "react";
import { Color, Vector3 } from "three";
import ParticleMesh from "./ParticleMesh";
import { Edges } from "@react-three/drei";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { generateRandomVector3 } from "../../functions/common";

type ParticlesProps = {
    count?: number,
    particleRadius?: number,
    borderLimit?: number,
    speed?: number
}

function ParticlesScene({ count = 10, particleRadius = 1, borderLimit = 10, speed = 0.001 }: ParticlesProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext; 
    
    const positions: Vector3[] = useMemo(() => {
        let collections: Vector3[] = [];
        for(let i = 0; i < count; i++) {
            collections.push(generateRandomVector3(borderLimit));
        }
        return collections;
    }, [count, particleRadius, borderLimit]);

    return (
        <group>
            {positions.map((position, index) =>
                <ParticleMesh position={position} particleRadius={particleRadius} borderLimit={borderLimit} speed={speed} key={index}/>
            )}
            <boxGeometry args={[borderLimit, borderLimit, borderLimit]}/>
            <Edges color={theme === Theme.Light ? Color.NAMES.black : Color.NAMES.white}/>
        </group>
    );
}

export default ParticlesScene;