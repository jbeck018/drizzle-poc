import React, { useState, useCallback } from "react";
import { HStack, Button, Input, Box } from "@chakra-ui/react";
import { startCase } from "lodash-es";
import { XIcon } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";
import { textOperators, numberOperators, booleanOperators, dateOperators } from "./operators";
import type { ListPropertiesLoader } from '#app/routes/api+/list-properties';
import { Select, AsyncSelect } from 'chakra-react-select';
import { chakraStyles } from "#app/theme/components/select";
import { motion } from 'framer-motion';
import { useLoadFetcherData } from "#app/hooks";

export const ConditionComponent: React.FC<{
    groupIndex: number;
    subGroupIndex: number;
    conditionIndex: number;
    removeCondition: () => void;
}> = ({ groupIndex, subGroupIndex, conditionIndex, removeCondition }) => {
    const { control, watch } = useFormContext();
    const [properties, setProperties] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const recordType = watch('recordType');
    const property = watch(`groups.${groupIndex}.subGroups.${subGroupIndex}.conditions.${conditionIndex}.property`);
    const operator = watch(`groups.${groupIndex}.subGroups.${subGroupIndex}.conditions.${conditionIndex}.operator`);

    const { data, isLoading, loadData } = useLoadFetcherData<ListPropertiesLoader>({ url: '/api/list-properties' });

    const getOperatorsForType = (type: string) => {
        const resp = {
            'string': textOperators,
            'number': numberOperators,
            'boolean': booleanOperators,
            'date': dateOperators,
            '': textOperators,
        }[type || 'string'];

        if (!resp) {
            return textOperators;
        }
        
        return resp;
    };

    const loadPropertyOptions = useCallback(async (inputValue: string) => {
        if (recordType) {
            loadData({ recordType, page: page.toString(), pageSize: '10', search: inputValue });
            if (data) {
                return Object.entries(data).map(([key, value]) => ({
                    value: key,
                    label: startCase(key),
                    type: value, // Store the property type
                }));
            }
        }
        return [];
    }, [recordType, page, loadData, data]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            <HStack spacing={2}>
                <Controller
                    name={`groups.${groupIndex}.subGroups.${subGroupIndex}.conditions.${conditionIndex}.property`}
                    control={control}
                    render={({ field }) => (
                        <Box position="relative" width="200px">
                            <AsyncSelect
                                {...field}
                                menuPortalTarget={document.body}
                                chakraStyles={chakraStyles}
                                placeholder="Select Property"
                                loadOptions={loadPropertyOptions}
                                onMenuScrollToBottom={() => {
                                    setPage((prevPage) => prevPage + 1);
                                }}
                                cacheOptions
                                defaultOptions
                                isLoading={isLoading}
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption?.value);
                                    // Update the properties state with the selected property type
                                    if (selectedOption) {
                                        setProperties(prev => ({
                                            ...prev,
                                            [selectedOption.value]: selectedOption.type,
                                        }));
                                    }
                                }}
                            />
                        </Box>
                    )}
                />
                <Controller
                    name={`groups.${groupIndex}.subGroups.${subGroupIndex}.conditions.${conditionIndex}.operator`}
                    control={control}
                    render={({ field }) => (
                        <Box position="relative" width="200px">
                            <Select
                                {...field}
                                menuPortalTarget={document.body}
                                chakraStyles={chakraStyles}
                                placeholder="Select Operator"
                                isDisabled={!property}
                                options={property && properties[property] &&
                                    getOperatorsForType(
                                        properties[property]
                                    ).map((op) => ({
                                        value: op.key,
                                        label: op.label
                                    }))}
                            />
                        </Box>
                    )}
                />
                <Controller
                    name={`groups.${groupIndex}.subGroups.${subGroupIndex}.conditions.${conditionIndex}.value`}
                    control={control}
                    render={({ field }) => {
                        const propertyType = properties[property as keyof typeof properties];
                        const operatorObj = getOperatorsForType(propertyType as string).find(
                            (op) => op.key === operator
                        );
                        if (!operatorObj || !operator) {
                            return <Input disabled placeholder='Select an operator first...' />;
                        }
                        if (operatorObj.key === 'in' || operatorObj.key === 'notIn') {
                            return React.cloneElement(operatorObj.input as React.ReactElement, {
                                ...field,
                                recordType,
                                propertyKey: property,
                            });
                        }
                        return React.cloneElement(operatorObj.input as React.ReactElement, { ...field });
                    }}
                />
                <Button colorScheme='red' onClick={removeCondition}><XIcon /></Button>
            </HStack>
        </motion.div>
    );
};