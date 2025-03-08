import registerCreate from './create/index.js';
import registerConfig from './config/index.js';
import registerZc from './zc/index.js';

const registerCommands = (program) => {
  // 注册所有命令
  registerCreate(program);
  registerConfig(program);
  registerZc(program);
};

export default registerCommands; 


