#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { add } from './tools/add';

const server = new FastMCP({
  name: 'mcp-photo-studio',
  version: '1.0.0',
});

server.addTool(add);

server.start({
  transportType: 'stdio',
});
