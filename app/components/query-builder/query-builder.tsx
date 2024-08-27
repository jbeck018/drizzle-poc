import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, useWatch, FormProvider } from 'react-hook-form';
import { Box, Button, VStack, Flex, Text } from '@chakra-ui/react';
import { QueryBuilderProps, FormData } from './types';
import { PlusIcon } from 'lucide-react';
import { GroupComponent } from './components';
import { record_type_zod_enum } from "#db/schema";
import { startCase } from "lodash-es";
import { Select } from 'chakra-react-select';
import { chakraStyles } from '#app/theme/components/select';
import { motion, AnimatePresence } from 'framer-motion';

const QueryBuilder: React.FC<QueryBuilderProps> = ({ accordionStart = 'open', onSubmit }) => {
  const form = useForm<FormData>({
    defaultValues: {
      recordType: '',
      groups: [{ subGroups: [{ conditions: [{ property: '', operator: '', value: '' }] }] }]
    }
  });
  const { control, handleSubmit, setValue, watch } = form;
  const { fields: groups, append: appendGroup, remove: removeGroup } = useFieldArray({
    control,
    name: "groups"
  });

  const [isValidQuery, setIsValidQuery] = useState(false);
  const formData = useWatch({ control });
  const recordType = watch('recordType');

  useEffect(() => {
    const checkQueryValidity = async () => {
      try {
        await onSubmit(formData as FormData);
        setIsValidQuery(true);
      } catch (error) {
        setIsValidQuery(false);
      }
    };

    checkQueryValidity();
  }, [formData, onSubmit]);

  const addGroup = () => {
    appendGroup({ subGroups: [{ conditions: [{ property: '', operator: '', value: '' }] }] });
  };

  return (
    <Box>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4} align="stretch">
            <Select
              chakraStyles={chakraStyles}
              placeholder="Select Record Type"
              menuPortalTarget={document.body}
              onChange={(option: any) => setValue('recordType', option?.value as keyof typeof record_type_zod_enum.enum)}
              options={Object.keys(record_type_zod_enum.enum).map((type) => ({
                value: type,
                label: startCase(type)
              }))}
              value={recordType ? { value: recordType, label: startCase(recordType) } : null}
            />
            <AnimatePresence>
              {recordType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <VStack spacing={4} align="stretch">
                    {groups.map((group, groupIndex) => (
                      <Flex key={group.id} direction="column" gap={4}>
                        <GroupComponent
                          group={group}
                          groupIndex={groupIndex}
                          control={control}
                          removeGroup={removeGroup}
                          appendGroup={appendGroup}
                          accordionStart={accordionStart}
                        />
                        {groupIndex < groups.length - 1 && (
                          <Button disabled colorScheme='green' alignSelf="flex-start">OR</Button>
                        )}
                      </Flex>
                    ))}
                    <Flex justifyContent="flex-start">
                      <Button onClick={addGroup} px={5}>
                        <PlusIcon height={16} width={16} />
                        Add Group
                      </Button>
                    </Flex>
                    <Button type="submit" colorScheme="blue" isDisabled={!isValidQuery}>
                      Build Query
                    </Button>
                    {!isValidQuery && (
                      <Text color="red.500">Invalid query. Please check your conditions.</Text>
                    )}
                  </VStack>
                </motion.div>
              )}
            </AnimatePresence>
          </VStack>
        </form>
      </FormProvider>
    </Box>
  );
};

export default QueryBuilder;