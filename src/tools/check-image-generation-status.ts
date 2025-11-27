import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { queryComfyUIImageStatus } from '../utils/comfyui';

const name = '查询生图任务状态';
const description = '查询生图任务状态，并以自然语言形式输出结果';
const parameters = z.object({
  generateUuid: z.string().describe('生图任务UUID，发起生图任务时返回的字段'),
});

type CheckImageGenerationStatusParams = z.infer<typeof parameters>;

const checkImageGenerationStatus: Tool<
  any,
  z.ZodType<CheckImageGenerationStatusParams>
> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const { generateUuid } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Checking image generation status', { generateUuid });

    try {
      // 调用查询生图状态函数
      const result = await queryComfyUIImageStatus(generateUuid);

      // 将结果转换为自然语言描述
      const statusDescriptions: Record<number, string> = {
        1: '等待执行',
        2: '执行中',
        3: '已生图',
        4: '审核中',
        5: '任务成功',
        6: '任务失败',
      };

      const auditStatusDescriptions: Record<number, string> = {
        1: '待审核',
        2: '审核中',
        3: '审核通过',
        4: '审核拦截',
        5: '审核失败',
      };
      if (typeof result === 'string') {
        throw new Error(result);
      }

      const statusText =
        statusDescriptions[result.generateStatus] || '未知状态';

      let naturalLanguageOutput = `任务UUID: ${result.generateUuid}\n`;
      naturalLanguageOutput += `任务状态: ${statusText} (${result.generateStatus})\n`;
      naturalLanguageOutput += `任务进度: ${(
        result.percentCompleted * 100
      ).toFixed(2)}%\n`;

      if (result.generateMsg) {
        naturalLanguageOutput += `附加信息: ${result.generateMsg}\n`;
      }

      if (result.generateStatus === 5) {
        // 任务成功，显示图片信息
        naturalLanguageOutput += `\n图片生成成功！\n`;
        // naturalLanguageOutput += `消耗点数: ${result.pointsCost}\n`;
        // naturalLanguageOutput += `剩余余额: ${result.accountBalance}\n\n`;

        if (result.images.length > 0) {
          naturalLanguageOutput += `生成的图片:\n`;
          result.images.forEach((image, index) => {
            const auditStatusText =
              auditStatusDescriptions[image.auditStatus] || '未知状态';
            naturalLanguageOutput += `${index + 1}. 图片地址: ${
              image.imageUrl
            }\n`;
            naturalLanguageOutput += `   审核状态: ${auditStatusText} (${image.auditStatus})\n`;
            naturalLanguageOutput += `   节点ID: ${image.nodeId}\n`;
          });
        } else {
          naturalLanguageOutput += `未生成任何图片。\n`;
        }

        if (result.videos.length > 0) {
          naturalLanguageOutput += `\n生成的视频:\n`;
          result.videos.forEach((video, index) => {
            naturalLanguageOutput += `${index + 1}. ${JSON.stringify(video)}\n`;
          });
        }
      } else if (result.generateStatus === 6) {
        // 任务失败
        naturalLanguageOutput += `\n图片生成失败，请检查参数或重试。\n`;
      } else if ([2, 3, 4].includes(result.generateStatus)) {
        // 处理中状态
        naturalLanguageOutput += `\n正在处理中，请稍后再查询。\n`;
      }

      logger.info('Image generation status checked successfully', {
        generateUuid,
        status: result.generateStatus,
      });

      return naturalLanguageOutput;
    } catch (error) {
      logger.error('Failed to check image generation status', {
        error: (error as Error).message,
        generateUuid,
      });
      return `查询生图任务状态失败: ${(error as Error).message}`;
    }
  },
};

export { checkImageGenerationStatus };
