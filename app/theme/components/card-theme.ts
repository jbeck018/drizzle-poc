import { cardAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";
import { colors } from "../colors";

const { definePartsStyle, defineMultiStyleConfig } =
	createMultiStyleConfigHelpers(cardAnatomy.keys);

const baseStyle = definePartsStyle({
	// define the part you're going to style
	container: {
		borderColor: colors.gray[400],
	},
});

const sizes = {
	md: definePartsStyle({
		container: {
			borderRadius: "4px",
		},
	}),
};

export const cardTheme = defineMultiStyleConfig({ baseStyle, sizes });
