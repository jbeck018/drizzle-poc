import { ThemeConfig, extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { globalStyles } from "./styles/globals";

const theme: ThemeConfig = extendTheme({
	styles: {
		global: globalStyles,
	},
	fonts: fonts,
	colors,
});

export default theme;
