import { ThemeConfig, extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { cardTheme } from "./components/card-theme";
import { fonts } from "./fonts";
import { globalStyles } from "./styles/globals";

const theme: ThemeConfig = extendTheme({
	components: {
		Card: cardTheme,
		Input: {
			variants: {
				outline: {
					// define the part you're going to style
					field: {
						boxShadow: "none",
						borderColor: colors.gray[400],
					},
				},
			},
		},
	},
	styles: {
		global: globalStyles,
	},
	border: `1px solid ${colors.gray[400]}`,
	fonts: fonts,
	colors,
});

export default theme;
