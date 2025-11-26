import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = 'old-photo-restoration';
const description = '老照片修复工具，可以修复和上色老照片，去除划痕和瑕疵';
const parameters = z.object({
  imageUrl: z.string().url().describe('老照片的URL地址'),
  prompt: z
    .string()
    .optional()
    .describe(
      '英文提示词，指导修复过程(默认为: "Restore and colorize this image. Remove any scratches or imperfections.")'
    ),
});

type OldPhotoRestorationParams = z.infer<typeof parameters>;

const oldPhotoRestoration: Tool<any, z.ZodType<OldPhotoRestorationParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      imageUrl,
      prompt = 'Restore and colorize this image. Remove any scratches or imperfections.',
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting old photo restoration', {
      imageUrl,
      prompt,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '191': {
        class_type: 'LoadImage',
        inputs: {
          image: imageUrl,
        },
      },
      '196': {
        class_type: 'Text Multiline',
        inputs: {
          text: prompt,
        },
      },
      workflowUuid: '2096b4fa51854407b2d2c75962ac81dd',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Old photo restoration workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute old photo restoration', {
        error: (error as Error).message,
      });
      return 'Failed to execute old photo restoration';
    }
  },
};

export { oldPhotoRestoration };
