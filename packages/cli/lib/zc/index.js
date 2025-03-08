import zcHandler from './handler.js';

const registerZc = (program) => {
  program
    .command('zc')
    .description('zc 命令')
    .option('-v, --verbose', '显示详细信息')
    .action(zcHandler);
};

export default registerZc; 