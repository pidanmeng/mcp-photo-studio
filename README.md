# mcp-photo-studio

这是一个基于 [FastMCP](https://github.com/fastmcp/fastmcp) 框架构建的 MCP (Model Context Protocol) 工具包。

## 功能

当前实现了一个简单的数学工具：

- `add`: 用于执行两个数字相加的操作

## 部署 MCP

```JSON
{
  "mcpServers": {
    "mcp-photo-studio": {
      "args": ["-y","@pidanmoe/mcp-photo-studio"],
      "command": "npx",
      "env": {
        // 环境变量
      }
    }
  }
}
```

## 使用说明

该项目遵循 Model Context Protocol 规范，可以通过标准 I/O 或其他传输方式与支持 MCP 的客户端进行通信。

### 工具介绍

#### add

用于执行两个数字相加的操作

- 必填参数:
  - `a`: 第一个操作数
  - `b`: 第二个操作数
- 返回: a + b 的值

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

- [index.ts](file:///Volumes/SSD/_work/resend-mcp/index.ts): 主入口文件，初始化并启动 FastMCP 服务器
- [tools/add.ts](file:///Volumes/SSD/_work/resend-mcp/tools/add.ts): 实现了 `add` 工具，支持两个数字相加操作
- [utils/logger.ts](file:///Volumes/SSD/_work/resend-mcp/utils/logger.ts): 日志工具模块

## 技术栈

- [Bun](https://bun.sh) - JavaScript/TypeScript 运行时
- [FastMCP](https://github.com/fastmcp/fastmcp) - MCP 框架
- [Zod](https://zod.dev) - TypeScript-first schema declaration and validation library

---

此项目使用 bun v1.2.19 创建。[Bun](https://bun.com) 是一个快速的一体化 JavaScript 运行时。
