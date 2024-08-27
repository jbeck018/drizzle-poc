import { AccordionItem, AccordionButton, AccordionIcon, Box, Text, Button, AccordionPanel, VStack, Flex } from "@chakra-ui/react";
import { XIcon, PlusIcon } from "lucide-react";
import { FilterCondition, FilterSubGroup } from "../types";
import { ConditionComponent } from "./condition";
import { useFormContext } from "react-hook-form";
import { AnimatePresence } from 'framer-motion';

export const SubGroupComponent: React.FC<{
    groupIndex: number;
    subGroupIndex: number;
    subGroup: FilterSubGroup;
    accordionStart: 'open' | 'closed';
    updateSubGroups: (newSubGroups: FilterSubGroup[]) => void;
  }> = ({ groupIndex, subGroupIndex, subGroup, updateSubGroups }) => {
    const form = useFormContext();
    const recordType = form.watch('recordType');

    return (
      <AccordionItem>
        <h3>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <Text fontWeight="bold">Subgroup {subGroupIndex + 1}</Text>
            </Box>
            <AccordionIcon />
            <Button ml={2} colorScheme={'red'} size={'sm'} variant={'ghost'} onClick={() => {
              const newSubGroups = [...subGroup.conditions.slice(0, subGroupIndex), ...subGroup.conditions.slice(subGroupIndex + 1)];
              updateSubGroups(newSubGroups.map(condition => ({ conditions: [condition] })));
            }}><XIcon height={16} width={16} /></Button>
          </AccordionButton>
        </h3>
        <AccordionPanel pb={4}>
          <Box p={3} borderWidth={1} borderRadius="md">
            <VStack spacing={3} align="stretch">
              <AnimatePresence>
                {subGroup.conditions.map((_condition, conditionIndex) => (
                  <ConditionComponent
                    key={conditionIndex}
                    groupIndex={groupIndex}
                    subGroupIndex={subGroupIndex}
                    conditionIndex={conditionIndex}
                    removeCondition={() => {
                      const newConditions = subGroup.conditions.filter((_, index) => index !== conditionIndex);
                      updateSubGroups([
                        ...subGroup.conditions.slice(0, subGroupIndex),
                        { conditions: newConditions },
                        ...subGroup.conditions.slice(subGroupIndex + 1)
                      ].map(item => 'conditions' in item ? item : { conditions: [item] }));
                    }}
                  />
                ))}
              </AnimatePresence>
              <Flex justifyContent="flex-start">
                <Button 
                  onClick={() => {
                    const newConditions = [...subGroup.conditions, { recordType, property: '', operator: '', value: '' } as FilterCondition];
                    updateSubGroups([
                      ...subGroup.conditions.slice(0, subGroupIndex),
                      { conditions: newConditions },
                      ...subGroup.conditions.slice(subGroupIndex + 1)
                    ].map(item => 'conditions' in item ? item : { conditions: [item] }));
                  }}
                  isDisabled={!subGroup.conditions[subGroup.conditions.length - 1]?.property}
                >
                  <PlusIcon height={16} width={16} />
                </Button>
              </Flex>
            </VStack>
          </Box>
        </AccordionPanel>
      </AccordionItem>
    );
  };