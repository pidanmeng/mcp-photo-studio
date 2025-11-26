import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = 'texture-enhancement';
const description = '质感增强工具，对图片进行质感增强处理';
const parameters = z.object({
  imageUrl: z.string().url().describe('原图的URL地址'),
});

type TextureEnhancementParams = z.infer<typeof parameters>;

const textureEnhancement: Tool<any, z.ZodType<TextureEnhancementParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { imageUrl } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting texture enhancement', {
      imageUrl,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '131': {
        class_type: 'LoadImage',
        inputs: {
          image: imageUrl,
        },
      },
      '205': {
        class_type: 'LoraLoader',
        inputs: {
          lora_name: '0cf6cf2b87bc43f48603b5905dc6c2c5',
          strength_model: 1,
        },
      },
      workflowUuid: 'c44f310cd0df4771be5bddfea6350c3a',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Texture enhancement workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute texture enhancement', {
        error: (error as Error).message,
      });
      return 'Failed to execute texture enhancement';
    }
  },
};

export { textureEnhancement };