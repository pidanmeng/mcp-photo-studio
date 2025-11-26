import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = 'product-image-retouching';
const description = '产品图精修工具，对商品图片进行专业精修处理';
const parameters = z.object({
  productImageUrl: z.string().url().describe('商品图的URL地址'),
});

type ProductImageRetouchingParams = z.infer<typeof parameters>;

const productImageRetouching: Tool<any, z.ZodType<ProductImageRetouchingParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      productImageUrl
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting product image retouching', {
      productImageUrl,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '20': {
        class_type: 'LoadImage',
        inputs: {
          image: productImageUrl,
        },
      },
      workflowUuid: '3ce63f1f851942e59b32f17866c4c1c7',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Product image retouching workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute product image retouching', {
        error: (error as Error).message,
      });
      return 'Failed to execute product image retouching';
    }
  },
};

export { productImageRetouching };