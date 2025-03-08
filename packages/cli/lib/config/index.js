import { handleGet, handleSet, handleDelete, handleList } from './handler.js';

const registerConfig = (program) => {
  const config = program
    .command('config')
    .description('管理配置项');

  // 获取配置
  config
    .command('get <key>')
    .description('获取配置项的值')
    .option('-g, --global', '使用全局配置')
    .action(handleGet);

  // 设置配置
  config
    .command('set <key> <value>')
    .description('设置配置项的值')
    .option('-g, --global', '使用全局配置')
    .action(handleSet);

  // 删除配置
  config
    .command('delete <key>')
    .description('删除配置项')
    .option('-g, --global', '使用全局配置')
    .action(handleDelete);

  // 列出所有配置
  config
    .command('list')
    .description('列出所有配置项')
    .option('-g, --global', '使用全局配置')
    .action(handleList);
};

export default registerConfig; 