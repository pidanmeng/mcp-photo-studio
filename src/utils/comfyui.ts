import { createHmac } from 'crypto';
import { useLogger } from './logger';

// 定义基础URL
const BASE_URL = 'https://openapi.liblibai.cloud';

interface SignatureOptions {
  url: string;
  secretKey: string;
}

interface SignatureResult {
  signature: string;
  timestamp: number;
  signatureNonce: string;
}

type ParamsInput = {
  class_type: string;
  inputs: Record<string, string | number | boolean>;
};

export type GenerateParams = {
  workflowUuid: string;
  [nodeId: string]: ParamsInput | string;
};

interface ComfyUIRequest<T extends GenerateParams> {
  templateUuid: string;
  generateParams: T;
}

// 添加查询生图结果的响应数据接口
export interface ImageInfo {
  /**
   * 1：待审核
   * 2：审核中
   * 3：审核通过
   * 4：审核拦截
   * 5：审核失败
   */
  auditStatus: number;
  imageUrl: string;
  nodeId: string;
  outputName: string;
}

export interface GenerateStatusResult {
  accountBalance: number;
  /**
   * 1：等待执行
   * 2：执行中
   * 3：已生图
   * 4：审核中
   * 5：任务成功
   * 6：任务失败
   */
  generateStatus: number;
  generateUuid: string;
  images: ImageInfo[];
  percentCompleted: number;
  pointsCost: number;
  videos: any[];
  generateMsg?: string;
}

interface ComfyUIStatusResponse {
  code: number;
  data: GenerateStatusResult;
  msg: string;
}

/**
 * 生成签名
 * @param options 签名选项
 * @returns 签名结果
 */
export function generateSignature(options: SignatureOptions): SignatureResult {
  const { url, secretKey } = options;
  const timestamp = Date.now();
  const signatureNonce = Math.random().toString(36).substring(2, 18);

  // 原文 = URL地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
  const str = `${url}&${timestamp}&${signatureNonce}`;

  // 使用 HMAC-SHA1 算法生成签名
  const hmac = createHmac('sha1', secretKey);
  hmac.update(str);
  const hash = hmac.digest('base64');

  // 生成安全字符串
  let signature = hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return {
    signature,
    timestamp,
    signatureNonce,
  };
}

/**
 * 构建带认证参数的URL
 * @param path API路径
 * @param accessKey 访问密钥
 * @param secretKey 密钥
 * @returns 带认证参数的完整URL
 */
function buildAuthUrl(path: string, accessKey: string, secretKey: string) {
  const { signature, timestamp, signatureNonce } = generateSignature({
    url: path,
    secretKey,
  });

  const params = new URLSearchParams({
    AccessKey: accessKey,
    Signature: signature,
    Timestamp: timestamp.toString(),
    SignatureNonce: signatureNonce,
  });

  return `${BASE_URL}${path}?${params.toString()}`;
}

/**
 * 调用ComfyUI工作流
 * @param request 请求参数
 * @returns Promise<string>
 */
export async function invokeComfyUIWorkflow<T extends GenerateParams>(
  request: ComfyUIRequest<T>
): Promise<string> {
  const { templateUuid, generateParams } = request;
  const logger = useLogger();

  try {
    // 从环境变量获取认证信息
    const accessKey = process.env.LIB_ACCESS_KEY;
    const secretKey = process.env.LIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        'Missing LIB_ACCESS_KEY or LIB_SECRET_KEY environment variables'
      );
    }

    // 构建带认证参数的URL
    const path = '/api/generate/comfyui/app';
    const authUrl = buildAuthUrl(path, accessKey, secretKey);
    const body = {
      templateUuid,
      generateParams,
    };

    logger.info('authUrl', authUrl);
    logger.info('body', body);

    // 发送请求
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as ComfyUIStatusResponse;
    logger.info('ComfyUI workflow invoked successfully', {
      templateUuid,
      statusCode: response.status,
      result: String(result),
    });

    if (result.code !== 0 || !result.data) {
      throw new Error(`API Error: ${result.msg}`);
    }
    return JSON.stringify(result.data);
  } catch (error) {
    logger.error('Failed to invoke ComfyUI workflow', {
      error: (error as Error).message,
      templateUuid: request.templateUuid,
    });
    return `Failed to invoke ComfyUI workflow: ${error as string}`;
  }
}

/**
 * 查询生图任务状态
 * @param generateUuid 生图任务UUID
 * @returns Promise<GenerateStatusResult>
 */
export async function queryComfyUIImageStatus(
  generateUuid: string
): Promise<GenerateStatusResult | string> {
  const logger = useLogger();

  try {
    // 从环境变量获取认证信息
    const accessKey = process.env.LIB_ACCESS_KEY;
    const secretKey = process.env.LIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        'Missing LIB_ACCESS_KEY or LIB_SECRET_KEY environment variables'
      );
    }

    // 构建带认证参数的URL
    const path = '/api/generate/comfy/status';
    const authUrl = buildAuthUrl(path, accessKey, secretKey);

    // 发送请求
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generateUuid,
      }),
    });

    const result = (await response.json()) as ComfyUIStatusResponse;

    if (result.code !== 0) {
      throw new Error(`API Error: ${result.msg}`);
    }

    logger.info('ComfyUI image status queried successfully', {
      generateUuid,
      statusCode: response.status,
      generateStatus: result.data.generateStatus,
      percentCompleted: result.data.percentCompleted,
    });

    return result.data;
  } catch (error) {
    logger.error('Failed to query ComfyUI image status', {
      error: (error as Error).message,
      generateUuid,
    });
    return `Failed to query ComfyUI image status: ${error as string}`;
  }
}
