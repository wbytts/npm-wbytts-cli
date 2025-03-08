#!/usr/bin/env node

import { Command } from 'commander';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import registerCommands from '../lib/index.js';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 读取 package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../package.json'), 'utf8')
);

// 创建 commander 实例
const program = new Command();

// 设置基本信息
program
  .name('by')
  .description('冰冰的脚手架工具')
  .version(packageJson.version);

// 注册所有命令
registerCommands(program);

// 解析命令行参数
program.parse();
