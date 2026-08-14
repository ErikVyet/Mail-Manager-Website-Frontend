import { Box } from "@mui/material";
import SettingSearchbar from "./SettingSearchbar";
import { EditOutlined, SettingsOutlined } from "@mui/icons-material";
import VerticalExpandableMenu from "../common/VerticalExpandableMenu";

function SettingSidebar() {
    const personalize = {
        icon: <EditOutlined className="size-4!"/>,
        label: "Personalize",
        items: [
            { label: "Profile", path: "/settings/personalize/profile" },
            { label: "Theme", path: "settings/personalize/theme" }
        ]
    };

    const configurations = {
        icon: <SettingsOutlined className="size-4!" />,
        label: "Configure",
        items: [
            { label: "Secret key", path: "/settings/configure/secret-key" }
        ]
    };

    return (
        <Box className="px-4 pt-8">
            <SettingSearchbar/>
            <Box className="pt-4">
                <VerticalExpandableMenu icon={personalize.icon} label={personalize.label} items={personalize.items}/>
                <VerticalExpandableMenu icon={configurations.icon} label={configurations.label} items={configurations.items}/>
            </Box>
        </Box>
    );
}

export default SettingSidebar;