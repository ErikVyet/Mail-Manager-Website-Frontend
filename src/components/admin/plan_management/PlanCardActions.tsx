import { DeleteOutlined, EditOutlined } from "@mui/icons-material";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { TEXT_MUTUAL } from "../../../constants/style";
import { useState } from "react";
import PlanDeleteDialog from "./PlanDeleteDialog";

type PlanCardActionsProps = {
    planId: number,
    planName: string
}

function PlanCardActions({ planId, planName }: PlanCardActionsProps) {
    const [openDialog, setOpenDialog] = useState(false);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    return (
        <>
            <Stack className="justify-center items-center gap-3" direction={"row"}>
                <Tooltip title={"Edit"} arrow>
                    <IconButton className="bg-blue-500/30! rounded-sm!" size={"small"} disableRipple>
                        <EditOutlined className={`size-4.5! ${TEXT_MUTUAL}`} />
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Delete"} arrow>
                    <IconButton className="bg-red-500/30! rounded-sm!" size={"small"} disableRipple onClick={handleOpenDialog}>
                        <DeleteOutlined className={`size-4.5! text-red-500`} />
                    </IconButton>
                </Tooltip>
            </Stack>
            <PlanDeleteDialog open={openDialog} setOpen={setOpenDialog} planId={planId} planName={planName}/>
        </>
    );
}

export default PlanCardActions;