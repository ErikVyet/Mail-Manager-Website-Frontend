import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Canvas } from "@react-three/fiber";
import { Theme } from "../../enums/Theme";
import { OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import ParticlesScene from "./ParticlesScene";
import ParticlesControlPanel from "./ParticlesControlPanel";
import { ParticlesControlContext } from "../../contexts/ParticlesControlContext";

type ParticlesCanvasProps = {
    showControlPanel?: boolean
}

function ParticlesCanvas({ showControlPanel = false }: ParticlesCanvasProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const [count, setCount] = useState(80);
    const [particleRadius, setParticleRadius] = useState(0.02);
    const [borderLimit, setBorderLimit] = useState(10);
    const [speed, setSpeed] = useState(0.001);
    const [autoRotate, setAutoRotate] = useState(true);
    const [autoRotateSpeed, setAutoRotateSpeed] = useState(0.5);
    const [reverseOrbit, setReverseOrbit] = useState(false);
    const [bloomIntensity, setBloomIntensity] = useState(0.8);

    return (
        <ParticlesControlContext.Provider value={{ count, setCount, particleRadius, setParticleRadius, borderLimit, setBorderLimit, speed, setSpeed, autoRotate, setAutoRotate, autoRotateSpeed, setAutoRotateSpeed, reverseOrbit, setReverseOrbit, bloomIntensity, setBloomIntensity }}>
            <Canvas className={`absolute! top-0 left-0 h-screen! ${theme === Theme.Dark && 'bg-zinc-950'}`} camera={{ fov: 75 }}>
                <ambientLight intensity={1.5} />
                <directionalLight intensity={2} />
                <ParticlesScene count={count} particleRadius={particleRadius} borderLimit={borderLimit} speed={speed}/>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate={autoRotate} autoRotateSpeed={autoRotateSpeed} reverseOrbit={reverseOrbit}/>
                <EffectComposer>
                    <Bloom intensity={bloomIntensity} luminanceThreshold={0.9} luminanceSmoothing={0.03} mipmapBlur />
                </EffectComposer>
            </Canvas>
            {showControlPanel && (<ParticlesControlPanel/>)}
        </ParticlesControlContext.Provider>
    );
}

export default ParticlesCanvas;