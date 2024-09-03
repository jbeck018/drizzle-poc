import { sql } from 'drizzle-orm';
import { FormData } from '#app/components/query-builder/types';

export const generateOptimizedSQLQuery = async (formData: FormData): Promise<string> => {
  try {
    const groupQueries = formData.groups.map((group) => {
      const subGroupQueries = group.subGroups.map((subGroup) => {
        const conditionQueries = subGroup.conditions.map((condition) => {
          const table = sql`${sql.raw(formData.recordType)}`;
          const column = sql`${sql.raw(condition.property)}`;
          
          switch (condition.operator) {
            case 'equals':
              return sql`${table}.${column} = ${condition.value}`;
            case 'contains':
              return sql`${table}.${column} LIKE ${`%${condition.value}%`}`;
            case 'startsWith':
              return sql`${table}.${column} LIKE ${`${condition.value}%`}`;
            case 'endsWith':
              return sql`${table}.${column} LIKE ${`%${condition.value}`}`;
            case 'in':
              return sql`${table}.${column} IN (${sql.join(condition.value, sql`, `)})`;
            case 'notIn':
              return sql`${table}.${column} NOT IN (${sql.join(condition.value, sql`, `)})`;
            case 'notContains':
              return sql`${table}.${column} NOT LIKE ${`%${condition.value}%`}`;
            case 'notStartsWith':
              return sql`${table}.${column} NOT LIKE ${`${condition.value}%`}`;
            case 'notEndsWith':
              return sql`${table}.${column} NOT LIKE ${`%${condition.value}`}`;
            case 'notEquals':
              return sql`${table}.${column} != ${condition.value}`;
            case 'greaterThan':
              return sql`${table}.${column} > ${condition.value}`;
            case 'lessThan':
              return sql`${table}.${column} < ${condition.value}`;
            case 'lessThanOrEqual':
              return sql`${table}.${column} <= ${condition.value}`;
            case 'greaterThanOrEqual':
              return sql`${table}.${column} >= ${condition.value}`;
            case 'between':
              return sql`${table}.${column} BETWEEN ${condition.value[0]} AND ${condition.value[1]}`;
            case 'is':
              return sql`${table}.${column} = ${condition.value}`;
            case 'isNot':
              return sql`${table}.${column} != ${condition.value}`;
            case 'before':
              return sql`${table}.${column} < ${condition.value}`;
            case 'after':
              return sql`${table}.${column} > ${condition.value}`;
            default:
              throw new Error(`Unsupported operator: ${condition.operator}`);
          }
        });

        return sql`(${sql.join(conditionQueries, sql` AND `)})`;
      });

      return sql`(${sql.join(subGroupQueries, sql` OR `)})`;
    });

    const finalQuery = sql`SELECT * FROM ${sql.raw(formData.recordType)} WHERE ${sql.join(groupQueries, sql` AND `)}`;

    return finalQuery.toString();
  } catch (error) {
    if (error instanceof Error) {
      return Promise.reject(`Error generating optimized SQL query: ${error.message}`);
    } else {
      return Promise.reject('An unknown error occurred while generating the SQL query');
    }
  }
}