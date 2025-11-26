#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { portraitRetouching } from './tools/portrait-retouching';
import { checkImageGenerationStatus } from './tools/check-image-generation-status';
import { textureEnhancement } from './tools/texture-enhancement';
import { oldPhotoRestoration } from './tools/old-photo-restoration';
import { changeClothes } from './tools/change-clothes';
import { productImageRetouching } from './tools/product-image-retouching';
import { petOutfitChange } from './tools/pet-outfit-change';

const server = new FastMCP({
  name: 'mcp-photo-studio',
  version: '1.0.1',
});

server.addTool(checkImageGenerationStatus);
server.addTool(portraitRetouching);
server.addTool(textureEnhancement);
server.addTool(oldPhotoRestoration);
server.addTool(changeClothes);
server.addTool(productImageRetouching);
server.addTool(petOutfitChange);

server.start({
  transportType: 'stdio',
});
