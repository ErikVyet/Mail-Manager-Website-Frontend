import { createContext, type Dispatch, type SetStateAction } from "react";

export const ParticlesControlContext = createContext<{
    count: number,
    setCount: Dispatch<SetStateAction<number>>,
    particleRadius: number,
    setParticleRadius: Dispatch<SetStateAction<number>>,
    borderLimit: number,
    setBorderLimit: Dispatch<SetStateAction<number>>,
    speed: number,
    setSpeed: Dispatch<SetStateAction<number>>,
    autoRotate: boolean,
    setAutoRotate: Dispatch<SetStateAction<boolean>>,
    autoRotateSpeed: number,
    setAutoRotateSpeed: Dispatch<SetStateAction<number>>,
    reverseOrbit: boolean,
    setReverseOrbit: Dispatch<SetStateAction<boolean>>,
    bloomIntensity: number,
    setBloomIntensity: Dispatch<SetStateAction<number>>
} | null>(null);