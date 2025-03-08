import inquirer from 'inquirer';
import { execSync, spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const projectTypeChoices = [
  { name: '前端项目', value: 'frontend' },
  { name: '后端项目', value: 'backend' },
  { name: '其他', value: 'other' }
];

const frontendFrameworkChoices = [
  { name: 'Vue (使用 @vue/cli)', value: 'vue-cli' },
  { name: 'Vue (使用 create-vue)', value: 'create-vue' },
  { name: 'Vite', value: 'vite' }
];

const backendFrameworkChoices = [
  { name: 'NestJS', value: 'nest' }
];

const otherChoices = [
  { name: '暂无可用选项', value: 'none' }
];

// 获取当前目录名
const getCurrentDirName = () => {
  return path.basename(process.cwd());
};

// 使用 spawn 执行命令，更好地处理交互式命令
const spawnCommand = (command, args) => {
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`命令执行失败，退出码: ${code}`));
      }
    });

    childProcess.on('error', (err) => {
      reject(err);
    });
  });
};

const promptQuestions = async () => {
  // 询问项目名称
  const nameAnswer = await inquirer.prompt([
    {
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称 (输入 . 表示在当前目录创建):',
      default: 'my-project',
      validate: (input) => {
        if (input.trim() === '' && input !== '.') {
          return '项目名称不能为空';
        }
        return true;
      }
    }
  ]);

  // 询问项目类型
  const typeAnswer = await inquirer.prompt([
    {
      type: 'list',
      name: 'projectType',
      message: '请选择项目类型:',
      choices: projectTypeChoices
    }
  ]);
  
  // 根据项目类型询问框架
  let frameworkAnswers = {};
  
  if (typeAnswer.projectType === 'frontend') {
    frameworkAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择前端框架:',
        choices: frontendFrameworkChoices
      }
    ]);
  } else if (typeAnswer.projectType === 'backend') {
    frameworkAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择后端框架:',
        choices: backendFrameworkChoices
      }
    ]);
  } else if (typeAnswer.projectType === 'other') {
    frameworkAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择其他选项:',
        choices: otherChoices
      }
    ]);
  }
  
  // 处理在当前目录创建项目的情况
  const isCurrentDir = nameAnswer.projectName === '.';
  const projectName = isCurrentDir ? getCurrentDirName() : nameAnswer.projectName;
  
  return {
    projectName,
    isCurrentDir,
    ...typeAnswer,
    ...frameworkAnswers
  };
};

const createProject = async (options) => {
  try {
    console.log('开始创建项目...');
    
    // 获取用户输入
    const answers = await promptQuestions();
    
    console.log('项目配置:', answers);
    
    // 根据用户选择执行相应的脚手架命令
    const projectName = answers.projectName;
    const isCurrentDir = answers.isCurrentDir;
    const createInCurrentDir = isCurrentDir ? '.' : projectName;
    
    switch (answers.framework) {
      case 'vue-cli':
        console.log(`使用 @vue/cli 创建 Vue 项目: ${projectName}`);
        await spawnCommand('npx', [`@vue/cli create ${createInCurrentDir} ${options.directory ? `--dest ${options.directory}` : ''}`]);
        break;
        
      case 'create-vue':
        console.log(`使用 create-vue 创建 Vue 项目: ${projectName}`);
        console.log('接下来将进入 create-vue 的交互式问答过程，您需要回答多个问题！');

        await spawnCommand('npm', [`create vue@latest ${createInCurrentDir}`]);
        break;
        
      case 'vite':
        console.log(`使用 Vite 创建项目: ${projectName}`);
        console.log('接下来将进入 Vite 的交互式问答过程，您需要回答多个问题！');
        
        await spawnCommand('npm', [`create vite@latest ${createInCurrentDir}`]);
        break;
        
      case 'nest':
        console.log(`使用 NestJS 创建项目: ${projectName}`);
        await spawnCommand('npx', [`@nestjs/cli new ${createInCurrentDir} ${options.packageManager ? `--package-manager ${options.packageManager}` : ''}`]);
        break;
        
      case 'none':
      default:
        console.log('暂无可用选项，项目创建已取消');
        break;
    }
    
    console.log('项目创建完成!');
  } catch (error) {
    console.error('创建项目时出错:', error.message);
  }
};

export default createProject; 





