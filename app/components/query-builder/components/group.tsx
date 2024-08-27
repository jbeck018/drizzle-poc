import { Accordion, AccordionItem, AccordionButton, AccordionIcon, Text, Box, Button, AccordionPanel, VStack, Flex } from "@chakra-ui/react";
import { XIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { FilterCondition, FilterGroup, FilterSubGroup } from "../types";
import { SubGroupComponent } from "./sub-group";
import { motion, AnimatePresence } from 'framer-motion';

export const GroupComponent: React.FC<{
    group: FilterGroup;
    groupIndex: number;
    control: any;
    removeGroup: (index: number) => void;
    appendGroup: (group: FilterGroup) => void;
    accordionStart: 'open' | 'closed';
  }> = ({ group, groupIndex, control, removeGroup, appendGroup, accordionStart }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Accordion allowMultiple defaultIndex={accordionStart === 'open' ? [0] : []}>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold">Group {groupIndex + 1}</Text>
                </Box>
                <AccordionIcon />
                <Button ml={2} colorScheme={'red'} size={'sm'} variant={'ghost'} onClick={() => removeGroup(groupIndex)}><XIcon height={16} width={16}/></Button>
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Box p={4} borderWidth={1} borderRadius="md">
                <VStack spacing={4} align="stretch">
                  <Controller
                    name={`groups.${groupIndex}.subGroups`}
                    control={control}
                    render={({ field }) => (
                      <AnimatePresence>
                        {field.value.map((subGroup: FilterSubGroup, subGroupIndex: number) => (
                          subGroup.conditions.length > 0 && (
                            <SubGroupComponent
                              key={subGroupIndex}
                              groupIndex={groupIndex}
                              subGroupIndex={subGroupIndex}
                              subGroup={subGroup}
                              accordionStart={accordionStart}
                              updateSubGroups={(newSubGroups) => field.onChange(newSubGroups)}
                            />
                          )
                        ))}
                      </AnimatePresence>
                    )}
                  />
                  <Flex justifyContent="flex-start">
                    <Button onClick={() => {
                      const newSubGroups = [...group.subGroups, { conditions: [{ property: '', operator: '', value: '' }] as FilterCondition[] }];
                      appendGroup({ ...group, subGroups: newSubGroups });
                    }} px={5}>
                      Add Group
                    </Button>
                  </Flex>
                </VStack>
              </Box>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </motion.div>
    );
  };