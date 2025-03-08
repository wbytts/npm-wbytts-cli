import createHandler from './handler.js';

const registerCreate = (program) => {
  program
    .command('create')
    .description('创建一个新的项目')
    .option('-d, --directory [directory]', '指定项目创建目录')
    .option('-p, --package-manager [package-manager]', '指定包管理器 (npm/yarn/pnpm)', 'npm')
    .option('-t, --template [template]', '指定项目模板', 'default')
    .action(createHandler);
};

export default registerCreate; 