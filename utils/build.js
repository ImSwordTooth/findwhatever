// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const { rspack } = require('@rspack/core');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const config = require('../rspack.config');

config.mode = 'production';

const packageInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

rspack(config, function (err, stats) {
  if (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
  if (stats.hasErrors()) {
    console.error(stats.toString({ colors: true }));
    process.exit(1);
  }
  console.log(stats.toString({ chunks: false, colors: true }));

  // 打包 zip
  try {
    const zipDir = path.join(__dirname, '../zip');
    if (!fs.existsSync(zipDir)) {
      fs.mkdirSync(zipDir, { recursive: true });
    }
    const zipFileName = `${packageInfo.name}-${packageInfo.version}.zip`;
    const zipFilePath = path.join(zipDir, zipFileName);
    if (fs.existsSync(zipFilePath)) {
      fs.unlinkSync(zipFilePath);
    }
    execSync(`cd "${path.join(__dirname, '../build')}" && zip -qr "${zipFilePath}" .`);
    console.log(`\n🎉 ZIP 包已生成: zip/${zipFileName}\n`);
  } catch (zipErr) {
    console.error('Failed to create zip file:', zipErr);
  }
});
