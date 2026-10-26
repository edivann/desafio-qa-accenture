const { existsSync } = require('node:fs');
const { homedir } = require('node:os');
const { join } = require('node:path');
const { PUPPETEER_REVISIONS } = require('puppeteer-core');

function chromeForTesting() {
  const version = PUPPETEER_REVISIONS.chrome;
  const cache = process.env.CYPRESS_CFT_CACHE || join(homedir(), '.cache', 'puppeteer');
  const layouts = {
    'win32-x64': ['win64', 'chrome-win64', 'chrome.exe'],
    'linux-x64': ['linux64', 'chrome-linux64', 'chrome'],
    'darwin-x64': ['mac-x64', 'chrome-mac-x64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
    'darwin-arm64': ['mac-arm64', 'chrome-mac-arm64', 'Google Chrome for Testing.app', 'Contents', 'MacOS', 'Google Chrome for Testing'],
  };
  const layout = layouts[`${process.platform}-${process.arch}`];
  if (!layout) throw new Error(`Plataforma não configurada para Chrome for Testing: ${process.platform}-${process.arch}`);

  const [platform, ...executable] = layout;
  const browserPath = join(cache, 'chrome', `${platform}-${version}`, ...executable);
  if (!existsSync(browserPath)) {
    throw new Error(
      `Chrome for Testing ${version} não encontrado em ${browserPath}.\n`
      + `Instale conforme o README: npx @puppeteer/browsers@3.2.6 install chrome@${version} --path "${cache}"`,
    );
  }

  // O plugin precisa distinguir Chrome for Testing do Chrome convencional no modo visual.
  return {
    name: 'chrome-for-testing', family: 'chromium', channel: 'stable',
    displayName: 'Chrome for Testing', version,
    majorVersion: Number(version.split('.')[0]), path: browserPath,
  };
}

module.exports = chromeForTesting;
