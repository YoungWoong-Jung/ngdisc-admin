import { themeQuartz } from 'ag-grid-community';

// to use myTheme in an application, pass it to the theme grid option
export const TableTheme01 = themeQuartz
	.withParams({
        accentColor: "#087AD1",
        backgroundColor: "#FFFFFF",
        borderColor: "#D7E2E6",
        borderRadius: 2,
        browserColorScheme: "light",
        cellHorizontalPaddingScale: 0.7,
        chromeBackgroundColor: {
            ref: "backgroundColor"
        },
        columnBorder: false,
        fontFamily: {
            googleFont: "Inter"
        },
        fontSize: 14,
        foregroundColor: "#555B62",
        headerBackgroundColor: "#FFFFFF",
        headerFontSize: 14,
        headerFontWeight: 600,
        headerTextColor: "#202020",
        rowBorder: true,
        rowVerticalPaddingScale: 0.8,
        sidePanelBorder: true,
        spacing: 6,
        wrapperBorder: false,
        wrapperBorderRadius: 2
    });
