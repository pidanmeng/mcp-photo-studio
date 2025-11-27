# mcp-photo-studio

这是一个基于 [FastMCP](https://github.com/fastmcp/fastmcp) 框架构建的 MCP (Model Context Protocol) 工具包。

## 功能

影楼后期大师实现了多个实用的图像处理工具：

- `换装`: 换装工具，让模特穿上指定的服装
- `查询生图任务状态`: 查询生图任务状态，并以自然语言形式输出结果
- `老照片修复`: 老照片修复工具，可以修复和上色老照片，去除划痕和瑕疵
- `宠物换装`: 宠物换装工具，给宠物穿上指定的服饰
- `人像精修`: 人像精修工具，对人物照片进行美白、提升分辨率和减少 AI 感
- `产品图精修`: 产品图精修工具，对商品图片进行专业精修处理
- `质感增强`: 质感增强工具，对图片进行质感增强处理
- `证件照生成`: 证件照生成工具，根据照片生成标准证件照

## 部署 MCP

```JSON
{
  "mcpServers": {
    "mcp-photo-studio": {
      "args": ["-y","@pidanmoe/mcp-photo-studio"],
      "command": "npx",
      "env": {
        "LIB_SECRET_KEY": "",
        "LIB_ACCESS_KEY": ""
      }
    }
  }
}
```

## 使用说明

该项目遵循 Model Context Protocol 规范，可以通过标准 I/O 或其他传输方式与支持 MCP 的客户端进行通信。

### 工具介绍

#### 查询生图任务状态

查询生图任务状态，并以自然语言形式输出结果

- 必填参数:
  - `generateUuid`: 生图任务 UUID，发起生图任务时返回的字段
- 返回: 任务状态的自然语言描述

#### 换装

换装工具，让模特穿上指定的服装

- 必填参数:
  - `modelImageUrl`: 模特图片的 URL 地址
  - `clothImageUrl`: 衣服图片的 URL 地址
- 可选参数:
  - `prompt`: 提示词，用于指导换装过程(默认:"让图 1 的模特穿上图 2 的套装服饰，保持动作不变，生成全身照")
- 返回: 生图任务结果

#### 老照片修复

老照片修复工具，可以修复和上色老照片，去除划痕和瑕疵

- 必填参数:
  - `imageUrl`: 老照片的 URL 地址
- 可选参数:
  - `prompt`: 英文提示词，指导修复过程(默认为: "Restore and colorize this image. Remove any scratches or imperfections.")
- 返回: 生图任务结果

#### 宠物换装

宠物换装工具，给宠物穿上指定的服饰

- 必填参数:
  - `clothingImageUrl`: 衣服图片的 URL 地址
  - `petImageUrl`: 宠物图片的 URL 地址
- 可选参数:
  - `prompt`: 提示词，用于指导换装过程(默认为:把图 1 的衣服和配饰穿到图 2 宠物身上)
- 返回: 生图任务结果

#### 人像精修

人像精修工具，对人物照片进行美白、提升分辨率和减少 AI 感

- 必填参数:
  - `imageUrl`: 原图的 URL 地址
- 可选参数:
  - `whiteningStrength`: 美白强度(0~1)，皮肤原本就白不生效，建议默认 0.8
  - `maxResolution`: 最长边分辨率(2536~8000)
  - `aiReductionStrength`: 去 AI 感强度，建议 0.05~0.15，建议默认 0.1
- 返回: 生图任务结果

#### 产品图精修

产品图精修工具，对商品图片进行专业精修处理

- 必填参数:
  - `productImageUrl`: 商品图的 URL 地址
- 返回: 生图任务结果

#### 质感增强

质感增强工具，对图片进行质感增强处理

- 必填参数:
  - `imageUrl`: 原图的 URL 地址
- 返回: 生图任务结果

#### 证件照生成

证件照生成工具，根据照片生成标准证件照

- 必填参数:
  - `imageUrl`: 原图的 URL 地址
- 返回: 生图任务结果

## 安装依赖

```bash
bun install
```

## 运行项目

```bash
bun run dev
```

## 调试项目

```bash
bun run inspect
```

## 构建项目

```bash
bun run build
```

## 项目结构

- [index.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/index.ts): 主入口文件，初始化并启动 FastMCP 服务器
- [tools/](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/): 工具目录，包含各种图像处理工具
  - [change-clothes.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/change-clothes.ts): 实现了换装工具
  - [check-image-generation-status.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/check-image-generation-status.ts): 实现了生图任务状态查询工具
  - [old-photo-restoration.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/old-photo-restoration.ts): 实现了老照片修复工具
  - [pet-outfit-change.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/pet-outfit-change.ts): 实现了宠物换装工具
  - [portrait-retouching.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/portrait-retouching.ts): 实现了人像精修工具
  - [product-image-retouching.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/product-image-retouching.ts): 实现了产品图精修工具
  - [texture-enhancement.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/texture-enhancement.ts): 实现了质感增强工具
  - [id-photo.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/tools/id-photo.ts): 实现了证件照生成工具
- [utils/](file:///Volumes/SSD/_work/mcp-photo-studio/src/utils/): 工具类目录
  - [logger.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/utils/logger.ts): 日志工具模块
  - [comfyui.ts](file:///Volumes/SSD/_work/mcp-photo-studio/src/utils/comfyui.ts): ComfyUI 接口调用模块

## 技术栈

- [Bun](https://bun.sh) - JavaScript/TypeScript 运行时
- [FastMCP](https://github.com/fastmcp/fastmcp) - MCP 框架
- [Zod](https://zod.dev) - TypeScript-first schema declaration and validation library

---

此项目使用 bun v1.2.19 创建。[Bun](https://bun.com) 是一个快速的一体化 JavaScript 运行时。