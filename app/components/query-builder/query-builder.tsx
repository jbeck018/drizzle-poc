import React, { useState, useEffect } from 'react';
import { Box, Button, VStack, Input, Select, FormControl, FormLabel } from '@chakra-ui/react';
import { db } from '../../../db/db.server';
import { records, properties } from '../../../db/schema';

type Record = typeof records.$inferSelect;
type Property = typeof properties.$inferSelect;

type QueryParams = {
  selectedRecord: string;
  selectedProperty: string;
  operator: string;
  value: string;
};

const operators = ['=', '!=', '>', '<', '>=', '<=', 'LIKE', 'IN'];

const buildQuery = (params: QueryParams, records: Record[], properties: Property[]): string => {
  const { selectedRecord, selectedProperty, operator, value } = params;
  const record = records.find(r => r.id === selectedRecord);
  const property = properties.find(p => p.id === selectedProperty);

  if (!record || !property) {
    return '';
  }

  let queryValue = value;
  if (property.type === 'string' && operator !== 'IN') {
    queryValue = `'${value}'`;
  } else if (operator === 'IN') {
    queryValue = `(${value.split(',').map(v => `'${v.trim()}'`).join(', ')})`;
  }

  return `SELECT * FROM ${record.name} WHERE ${property.name} ${operator} ${queryValue}`;
};

export const QueryBuilder: React.FC = () => {
  const [queryParams, setQueryParams] = useState<QueryParams>({
    selectedRecord: '',
    selectedProperty: '',
    operator: '=',
    value: '',
  });
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [recordsList, setRecordsList] = useState<Record[]>([]);
  const [propertiesList, setPropertiesList] = useState<Property[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedRecords = await db.select().from(records);
      const fetchedProperties = await db.select().from(properties);
      setRecordsList(fetchedRecords);
      setPropertiesList(fetchedProperties);
    };
    fetchData();
  }, []);

  const handleInputChange = (field: keyof QueryParams) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setQueryParams(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGenerateQuery = () => {
    const query = buildQuery(queryParams, recordsList, propertiesList);
    setGeneratedQuery(query);
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Record</FormLabel>
          <Select value={queryParams.selectedRecord} onChange={handleInputChange('selectedRecord')}>
            <option value="">Select a record</option>
            {recordsList.map(record => (
              <option key={record.id} value={record.id}>{record.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Property</FormLabel>
          <Select value={queryParams.selectedProperty} onChange={handleInputChange('selectedProperty')}>
            <option value="">Select a property</option>
            {propertiesList.map(property => (
              <option key={property.id} value={property.id}>{property.name}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Operator</FormLabel>
          <Select value={queryParams.operator} onChange={handleInputChange('operator')}>
            {operators.map(op => (
              <option key={op} value={op}>{op}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Input value={queryParams.value} onChange={handleInputChange('value')} placeholder="Enter value" />
        </FormControl>
        <Button onClick={handleGenerateQuery}>Generate Query</Button>
        <Box>
          <FormLabel>Generated Query</FormLabel>
          <Box p={2} borderWidth={1} borderRadius="md">
            {generatedQuery || 'No query generated yet'}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};


