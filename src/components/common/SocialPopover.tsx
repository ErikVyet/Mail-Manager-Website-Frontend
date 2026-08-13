import { FacebookOutlined, GitHub, Instagram, LinkedIn, Reddit, X } from "@mui/icons-material";
import { Grid, Stack } from "@mui/material";
import { HOVER_BG_LIGHT } from "../../constants/style";
import { motion } from "motion/react";
import { ANIMATION_DELAY, ANIMATION_DURATION } from "../../constants/other";

function SocialPopover() {
    const socials = [
        { label: "Facebook", path: "https://www.facebook.com/hoang.erik.50/", icon: <FacebookOutlined className="size-5!"/> },
        { label: "Twitter", path: "https://x.com/ErikVyet", icon: <X className="size-5!"/> },
        { label: "Instagram", path: "https://www.instagram.com/qv_erik/", icon: <Instagram className="size-5!"/> },
        { label: "LinkedIn", path: null, icon: <LinkedIn className="size-5!"/> },
        { label: "Reddit", path: "https://www.reddit.com/user/Several_Path_6351/", icon: <Reddit className="size-5!"/> },
        { label: "GitHub", path: "https://github.com/ErikVyet", icon: <GitHub className="size-5!"/> }
    ];

    return (
        <Grid className="w-3xs p-1" spacing={0.5} container>
            {socials.map((social, index) =>
                <Grid className={`items-center justify-center rounded-sm cursor-pointer ${HOVER_BG_LIGHT} duration-300`} size={6} key={index}>
                    <Stack className="p-2 items-center gap-2 text-sm font-mono" direction={"row"} component={motion.div} initial={{ scale: 1, opacity: 0 }} whileHover={{ scale: 1.05 }} whileInView={{ opacity: 1, transition: { delay: ANIMATION_DELAY * index } }} transition={{ duration: ANIMATION_DURATION }}>{social.icon} {social.label}</Stack>
                </Grid>
            )}
        </Grid>
    );
}

export default SocialPopover;