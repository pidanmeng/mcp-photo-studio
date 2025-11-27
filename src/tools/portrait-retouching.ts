import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = '人像精修';
const description = '人像精修工具，对人物照片进行美白、提升分辨率和减少AI感';
const parameters = z.object({
  imageUrl: z.string().url().describe('原图的URL地址'),
  whiteningStrength: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe('美白强度(0~1)，皮肤原本就白不生效，建议默认 0.8'),
  maxResolution: z
    .number()
    .min(2536)
    .max(8000)
    .optional()
    .describe('最长边分辨率(2536~8000)'),
  aiReductionStrength: z
    .number()
    .min(0.05)
    .max(0.15)
    .optional()
    .describe('去AI感强度，建议0.05~0.15，建议默认 0.1'),
});

type PortraitRetouchingParams = z.infer<typeof parameters>;

const portraitRetouching: Tool<any, z.ZodType<PortraitRetouchingParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      imageUrl,
      whiteningStrength = 0.8,
      maxResolution = 2536,
      aiReductionStrength = 0.1,
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting portrait retouching', {
      imageUrl,
      whiteningStrength,
      maxResolution,
      aiReductionStrength,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '248': {
        class_type: 'Float',
        inputs: {
          Number: whiteningStrength.toString(),
        },
      },
      '252': {
        class_type: 'ImpactInt',
        inputs: {
          value: maxResolution,
        },
      },
      '281': {
        class_type: 'Float',
        inputs: {
          Number: aiReductionStrength.toString(),
        },
      },
      '285': {
        class_type: 'LoadImage',
        inputs: {
          image: imageUrl,
        },
      },
      workflowUuid: '1e172093a3e845209d89465879055fa0',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Portrait retouching workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute portrait retouching', {
        error: (error as Error).message,
      });
      return 'Failed to execute portrait retouching';
    }
  },
};

export { portraitRetouching };
