const { spawn } = require('child_process');
const path = require('path');

let serverProcess;

function startServer() {
  console.log('正在启动服务器...');
  
  serverProcess = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  serverProcess.on('exit', (code, signal) => {
    console.log(`服务器进程退出，退出码: ${code}, 信号: ${signal}`);
    console.log('5秒后尝试重启...');
    
    setTimeout(() => {
      startServer();
    }, 5000);
  });

  serverProcess.on('error', (err) => {
    console.error('启动服务器时发生错误:', err);
  });
}

// 监听 Ctrl+C 信号来优雅地关闭服务器
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  if (serverProcess) {
    serverProcess.kill('SIGINT');
  }
  process.exit(0);
});

// 启动服务器
startServer();