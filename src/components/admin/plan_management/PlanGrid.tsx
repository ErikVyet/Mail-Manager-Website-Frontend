import { Grid } from "@mui/material";
import type { Plan } from "../../../interfaces/Plan"

type PlanGridProps = {
    plans: Plan[];
}

function PlanGrid({ plans }: PlanGridProps) {

    return (
        <Grid container>

        </Grid>
    );
}

export default PlanGrid;