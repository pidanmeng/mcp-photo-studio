import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = '宠物换装';
const description = '宠物换装工具，给宠物穿上指定的服饰';
const parameters = z.object({
  clothingImageUrl: z.string().url().describe('衣服图片的URL地址'),
  petImageUrl: z.string().url().describe('宠物图片的URL地址'),
  prompt: z
    .string()
    .optional()
    .describe(
      '提示词，用于指导换装过程(默认为:把图1的衣服和配饰穿到图2宠物身上)'
    ),
});

type PetOutfitChangeParams = z.infer<typeof parameters>;

const petOutfitChange: Tool<any, z.ZodType<PetOutfitChangeParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      clothingImageUrl,
      petImageUrl,
      prompt = '把图1的衣服和配饰穿到图2宠物身上',
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting pet outfit change', {
      clothingImageUrl,
      petImageUrl,
      prompt,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '22': {
        class_type: 'Text Multiline',
        inputs: {
          text: prompt,
        },
      },
      '23': {
        class_type: 'LoadImage',
        inputs: {
          image: petImageUrl,
        },
      },
      '28': {
        class_type: 'LoadImage',
        inputs: {
          image: clothingImageUrl,
        },
      },
      workflowUuid: 'be89470a1760441096d0e6e0c29bdec3',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Pet outfit change workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute pet outfit change', {
        error: (error as Error).message,
      });
      return 'Failed to execute pet outfit change';
    }
  },
};

export { petOutfitChange };
