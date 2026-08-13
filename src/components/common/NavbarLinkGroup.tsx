import { Stack } from "@mui/material";
import type { JSX } from "react/jsx-runtime";

type NavbarLinkGroupProps = {
    children: JSX.Element | JSX.Element[]
}

function NavbarLinkGroup({ children }: NavbarLinkGroupProps) {
    return (
        <Stack className="h-full px-12 items-center justify-center gap-10" direction={"row"}>
            {children}
        </Stack>
    );
}

export default NavbarLinkGroup;