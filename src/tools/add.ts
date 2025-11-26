import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';

const name = 'add';
const description = 'add two numbers';
const parameters = z.object({
  a: z.number().describe('The first number to add'),
  b: z.number().describe('The second number to add'),
});

const add: Tool<any, z.ZodType<typeof parameters._type>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { a, b } = args;
    const { log } = context;
    const logger = useLogger(log);
    logger.info(`Adding ${a} and ${b}`);
    return (a + b).toString();
  },
};

export { add };
