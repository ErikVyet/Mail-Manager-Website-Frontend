import { FileDownloadOutlined } from "@mui/icons-material";
import { IconButton, List, ListItemButton, Popover, Tooltip } from "@mui/material";
import { useContext, useState, type MouseEvent } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";
import { Theme } from "../../enums/Theme";
import { BG_DARK_PRIMARY, BG_LIGHT_PRIMARY, HOVER_BG_DARK, HOVER_BG_LIGHT, TEXT_DARK, TEXT_LIGHT } from "../../constants/style";
import { utils, writeFile, writeFileXLSX } from "xlsx";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";

type ExportButtonProps = {
    data: any[],
    filename?: string,
    sheetName?: string
}

function ExportButton({ data, filename = "export_data", sheetName }: ExportButtonProps) {
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(null);

    const handleOpenPopover = (_event: MouseEvent<HTMLButtonElement>) => {
        setAnchorElement(_event.currentTarget);
    };
    const handleClosePopover = () => {
        setAnchorElement(null);
    };

    const handleExportSheet = () => {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, sheetName);
        writeFileXLSX(workbook, `${filename}.xlsx`);
    };
    const handleExportCsv = () => {
        const worksheet = utils.json_to_sheet(data);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, sheetName);
        writeFile(workbook, `${filename}.csv`, { bookType: "csv" });
    };
    const handleExportPdf = () => {
        const pdf = new jsPDF();
        pdf.setFont("Times New Roman");
        pdf.setFontSize(13);
        
        const columns = Object.keys(data.at(0));
        const rows = data.map(item => Object.values(item));

        autoTable(pdf, {
            head: [columns],
            body: rows,
            startY: 30,
            theme: "grid",
            headStyles: { fillColor: [2, 132, 199] }
        });

        pdf.save(`${filename}.pdf`);
    };
    const handleExportJson = () => {
        const json = JSON.stringify(data, null, 4);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${filename}.json`;
        document.body.appendChild(link);
        link.click();

        return () => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    };

    const options = [
        { label: "Sheet", extension: ".xlsx", onClick: handleExportSheet },
        { label: "CSV", extension: ".csv", onClick: handleExportCsv },
        { label: "PDF", extension: ".pdf", onClick: handleExportPdf },
        { label: "JSON", extension: ".json", onClick: handleExportJson }
    ];

    return (
        <>
            <Tooltip title={"Export"}>
                <IconButton className={`${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} size={"small"} color={"inherit"} onClick={handleOpenPopover}>
                    <FileDownloadOutlined className={`size-5! ${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}/>
                </IconButton>
            </Tooltip>
            <Popover open={Boolean(anchorElement)} anchorEl={anchorElement} anchorOrigin={{ vertical: "bottom", horizontal: "left" }} slotProps={{ paper: { className: theme === Theme.Light ? BG_LIGHT_PRIMARY : BG_DARK_PRIMARY } }} onClose={handleClosePopover}>
                <List className={`${theme === Theme.Light ? TEXT_LIGHT : TEXT_DARK}`}>
                    {options.map((option, index) =>
                        <ListItemButton className={`text-sm! ${theme === Theme.Light ? HOVER_BG_LIGHT : HOVER_BG_DARK}`} key={index} onClick={option.onClick}>{option.label} ({option.extension})</ListItemButton>
                    )}
                </List>
            </Popover>
        </>
    )
}

export default ExportButton;