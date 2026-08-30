import { useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Box, Collapse, IconButton, Stack, Tooltip } from "@mui/material";
import { Tune } from "@mui/icons-material";
import { Theme } from "../../enums/Theme";
import { BG_INPUT_DARK, BG_INPUT_LIGHT, SHADOW_DARK, SHADOW_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { ParticlesControlContext } from "../../contexts/ParticlesControlContext";
import SliderInput from "./SliderInput";
import CheckboxInput from "./CheckboxInput";

function ParticlesControlPanel() {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const particlesControlContext = useContext(ParticlesControlContext);
    if (!particlesControlContext) return null;
    const { count, setCount, particleRadius, setParticleRadius, borderLimit, setBorderLimit, speed, setSpeed, autoRotate, setAutoRotate, autoRotateSpeed, setAutoRotateSpeed, reverseOrbit, setReverseOrbit, bloomIntensity, setBloomIntensity } = particlesControlContext;

    const [openPanel, setOpenPanel] = useState(false);

    const handleTogglePanel = () => {
        setOpenPanel((prev) => !prev);
    };

    return (
        <Stack className="absolute top-3 left-3 gap-2">
            <Tooltip title={"Background control panel"} placement={"right"}>
                <IconButton className={`w-fit shadow-md ${theme === Theme.Light ? `${BG_INPUT_LIGHT} ${TEXT_LIGHT} ${SHADOW_LIGHT}` : `${BG_INPUT_DARK} ${TEXT_DARK} ${SHADOW_DARK}`} rounded-sm!`} onClick={handleTogglePanel}>
                    <Tune className="size-5!" />
                </IconButton>
            </Tooltip>
            <Collapse className="relative w-xs rounded-sm" in={openPanel}>
                <Box className={`absolute size-full rounded-sm ${theme === Theme.Light ? BG_INPUT_LIGHT : BG_INPUT_DARK} opacity-95`}/>
                <Stack className="p-2 gap-2">
                    <SliderInput label={"Quantity"} value={count} min={40} max={150} shiftStep={10} step={10} marks setValueFn={setCount}/>
                    <SliderInput label={"Particle radius"} value={particleRadius} min={0.01} max={0.1} shiftStep={0.01} step={0.01} displayValuePrecision={2} marks setValueFn={setParticleRadius}/>
                    <SliderInput label={"Border limit"} value={borderLimit} min={2} max={20} shiftStep={1} step={1} marks setValueFn={setBorderLimit}/>
                    <SliderInput label={"Speed"} value={speed} min={0.001} max={0.005} shiftStep={0.001} step={0.001} marks setValueFn={setSpeed}/>
                    <SliderInput label={"Bloom intensity"} value={bloomIntensity} min={0.2} max={1.8} shiftStep={0.2} displayValuePrecision={1} step={0.2} marks setValueFn={setBloomIntensity}/>
                    <CheckboxInput label={"Auto rotate"} value={autoRotate} setValueFn={setAutoRotate}/>
                    <Collapse className="w-full" in={autoRotate}>
                        <Stack className="gap-2">
                            <SliderInput label={"Rotate speed"} value={autoRotateSpeed} min={0.1} max={1} shiftStep={0.1} step={0.1} displayValuePrecision={1} marks setValueFn={setAutoRotateSpeed}/>
                            <CheckboxInput label={"Reverse orbit"} value={reverseOrbit} setValueFn={setReverseOrbit}/>
                        </Stack>
                    </Collapse>
                </Stack>
            </Collapse>
        </Stack>
    );
}

export default ParticlesControlPanel;