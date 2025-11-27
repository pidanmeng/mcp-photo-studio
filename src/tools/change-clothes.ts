import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = '换装';
const description = '换装工具，让模特穿上指定的服装';
const parameters = z.object({
  modelImageUrl: z.string().url().describe('模特图片的URL地址'),
  clothImageUrl: z.string().url().describe('衣服图片的URL地址'),
  prompt: z
    .string()
    .optional()
    .describe(
      '提示词，用于指导换装过程(默认:"让图1的模特穿上图2的套装服饰，保持动作不变，生成全身照")'
    ),
});

type ChangeClothesParams = z.infer<typeof parameters>;

const changeClothes: Tool<any, z.ZodType<ChangeClothesParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      modelImageUrl,
      clothImageUrl,
      prompt = '让图1的模特穿上图2的套装服饰，保持动作不变，生成全身照',
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting change clothes', {
      modelImageUrl,
      clothImageUrl,
      prompt,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '28': {
        class_type: 'LoadImage',
        inputs: {
          image: modelImageUrl,
        },
      },
      '30': {
        class_type: 'LoadImage',
        inputs: {
          image: clothImageUrl,
        },
      },
      '59': {
        class_type: 'GeminiImageNode',
        inputs: {
          prompt: prompt,
        },
      },
      workflowUuid: 'b3a998090a6d4daeb55732254333533c',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Change clothes workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute change clothes', {
        error: (error as Error).message,
      });
      return 'Failed to execute change clothes';
    }
  },
};

export { changeClothes };
