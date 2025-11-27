import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = '证件照生成';
const description = '证件照生成工具，根据照片生成标准证件照';
const parameters = z.object({
  imageUrl: z.string().url().describe('原图的URL地址'),
});

type IdPhotoParams = z.infer<typeof parameters>;

const idPhoto: Tool<any, z.ZodType<IdPhotoParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { imageUrl } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting ID photo generation', {
      imageUrl,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '23': {
        class_type: 'LoadImage',
        inputs: {
          image: imageUrl,
        },
      },
      workflowUuid: '384248225f3a4276877a54e2a2efa150',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('ID photo workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute ID photo generation', {
        error: (error as Error).message,
      });
      return 'Failed to execute ID photo generation';
    }
  },
};

export { idPhoto };
