import React, { useCallback, useState } from 'react';
import { Input, Switch, Box } from '@chakra-ui/react';
import { DatePicker } from '../../date-picker';
import type { UniqueTextOptionsLoader } from '#app/routes/api+/unique-text-options';
import { AsyncSelect } from 'chakra-react-select';
import { chakraStyles } from '#app/theme/components/select';
import { useLoadFetcherData } from '#app/hooks';

const MultiSelectWithLoader: React.FC<{ recordType: string, propertyKey: string }> = ({ recordType, propertyKey }) => {
  const [page, setPage] = useState(1);

  const { data, isLoading, loadData } = useLoadFetcherData<UniqueTextOptionsLoader>({ url: '/api/unique-text-options' });

  const loadOptions = useCallback(async (inputValue: string) => {
    if (recordType && propertyKey) {
      loadData({ recordType, propertyKey, page: page.toString(), pageSize: '10', search: inputValue });
      if (data) {
        return data.map((option) => ({ value: option, label: option }));
      }
    }
    return [];
  }, [recordType, propertyKey, page, loadData, data]);

  return (
    <Box position="relative">
      <AsyncSelect
        isMulti
        menuPortalTarget={document.body}
        chakraStyles={chakraStyles}
        placeholder="Choose an Option..."
        isLoading={isLoading}
        loadOptions={loadOptions}
        onMenuScrollToBottom={() => setPage(page + 1)}
        cacheOptions
        defaultOptions
      />
    </Box>
  );
};

export const textOperators = [
  { key: 'equals', label: 'Equals', input: <Input placeholder="Enter text" /> },
  { key: 'contains', label: 'Contains', input: <Input placeholder="Enter text" /> },
  { key: 'startsWith', label: 'Starts with', input: <Input placeholder="Enter text" /> },
  { key: 'endsWith', label: 'Ends with', input: <Input placeholder="Enter text" /> },
  { key: 'in', label: 'In', input: <MultiSelectWithLoader recordType="" propertyKey="" /> },
  { key: 'notIn', label: 'Not in', input: <MultiSelectWithLoader recordType="" propertyKey="" /> },
  { key: 'notContains', label: 'Not contains', input: <Input placeholder="Enter text" /> },
  { key: 'notStartsWith', label: 'Not starts with', input: <Input placeholder="Enter text" /> },
  { key: 'notEndsWith', label: 'Not ends with', input: <Input placeholder="Enter text" /> },
  { key: 'notEquals', label: 'Not equals', input: <Input placeholder="Enter text" />},
];

export const numberOperators = [
  { key: 'equals', label: 'Equals', input: <Input type="number" placeholder="Enter number" /> },
  { key: 'greaterThan', label: 'Greater than', input: <Input type="number" placeholder="Enter number" /> },
  { key: 'lessThan', label: 'Less than', input: <Input type="number" placeholder="Enter number" /> },
  { key: 'lessThanOrEqual', label: 'Less than or equal', input: <Input type="number" placeholder="Enter number" /> },
  { key: 'greaterThanOrEqual', label: 'Greater than or equal', input: <Input type="number" placeholder="Enter number" /> },
  { key: 'between', label: 'Between', input: (
    <>
      <Input type="number" placeholder="Min" mr={2} />
      <Input type="number" placeholder="Max" />
    </>
  ) },
];

export const booleanOperators = [
  { key: 'is', label: 'Is', input: <Switch /> },
  { key: 'isNot', label: 'Is not', input: <Switch /> },
];

export const dateOperators = [
  { key: 'before', label: 'Before', input: <DatePicker selectedDate={undefined} onChange={() => {}} /> },
  { key: 'after', label: 'After', input: <DatePicker selectedDate={undefined} onChange={() => {}} /> },
  { key: 'between', label: 'Between', input: (
    <>
      <DatePicker selectedDate={undefined} onChange={() => {}} />
      <DatePicker selectedDate={undefined} onChange={() => {}} />
    </>
  ) },
];