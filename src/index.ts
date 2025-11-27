#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { portraitRetouching } from './tools/portrait-retouching';
import { checkImageGenerationStatus } from './tools/check-image-generation-status';
import { textureEnhancement } from './tools/texture-enhancement';
import { oldPhotoRestoration } from './tools/old-photo-restoration';
import { changeClothes } from './tools/change-clothes';
import { productImageRetouching } from './tools/product-image-retouching';
import { petOutfitChange } from './tools/pet-outfit-change';
import { idPhoto } from './tools/id-photo';

const server = new FastMCP({
  name: 'mcp-photo-studio',
  version: '1.0.2',
});

server.addTool(checkImageGenerationStatus);
server.addTool(portraitRetouching);
server.addTool(textureEnhancement);
server.addTool(oldPhotoRestoration);
server.addTool(changeClothes);
server.addTool(productImageRetouching);
server.addTool(petOutfitChange);
server.addTool(idPhoto);

server.start({
  transportType: 'stdio',
});