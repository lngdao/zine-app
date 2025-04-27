/**
 * @author lngdao
 * @desc This script is authored by @studio-hysteric and is subject to the MIT License.
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const readline = require('readline');
const { execSync } = require('child_process');

var WORKSPACE_PATH = path.resolve(__dirname, '..');

// config
var config = {
  srcFolderName: 'src',
  assetFolderName: 'assets',
  resources: {
    images: {
      resourceFolderName: 'resources',
      exts: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'tif'],
      handler: imageHandler,
    },
    icons: {
      resourceFolderName: 'resources',
      exts: ['svg'],
      handler: iconHandler,
    },
  },
};

/**
 * Your custom handler here
 */

function imageHandler(res) {
  const subItems = getSubItems(res.resourcePath);

  log.done(`Found ${subItems.length} items`);

  let i = 0;

  if (!subItems.length) {
    fs.writeFileSync(res.entryFilePath, 'export {};');
    return { [res.name]: i };
  }

  const content = subItems
    .map((item) => {
      const itemName = parseFileName(item);
      const itemPath = `./${res.resourceFolderName}/${item}`;

      if (matchFileExt(item, res.exts)) {
        i++;

        return `export const ${itemName} = require('${itemPath}');`;
      } else {
        log.warn(`- ${item} (not in list of extensions)`);
        return null;
      }
    })
    .filter(Boolean)
    .join('\n');

  if (i !== 0) {
    log.done(`Write ${i} files`);
    log.done('Rewrite entry file');
    fs.writeFileSync(res.entryFilePath, content);
    prettier(res.path);
  }

  return { [res.name]: i };
}

function iconHandler(res) {
  const subItems = getSubItems(res.resourcePath);

  log.done(`Found ${subItems.length} items`);

  let i = 0;

  if (!subItems.length) {
    fs.writeFileSync(res.entryFilePath, 'export {};');
    return { [res.name]: i };
  }

  const content = subItems
    .map((item) => {
      const itemName = parseFileName(item);
      const itemPath = `./${res.resourceFolderName}/${item}`;

      if (matchFileExt(item, res.exts)) {
        i++;

        return `export {default as ${itemName}} from '${itemPath}';`;
      } else {
        log.warn(`- ${item} (not in list of extensions)`);
        return null;
      }
    })
    .filter(Boolean)
    .join('\n');

  if (i !== 0) {
    log.done(`Write ${i} files`);
    log.done('Rewrite entry file');
    fs.writeFileSync(res.entryFilePath, content);
    prettier(res.path);
  }

  return { [res.name]: i };
}

// logger
var log = console.log;
var logLine = (...args) =>
  Boolean(args.length) && log(`\n${args[0]}`, ...args.slice(1));

Object.assign(log, {
  done: log.bind(console, chalk.greenBright('✓ %s')),
  warn: log.bind(console, chalk.hex('#FFA500')('✕ %s')),
  special: logLine.bind(console, chalk.bold('👌  %s')),
});

// utils
function spinLoading(
  text = '',
  chars = ['⠙', '⠘', '⠰', '⠴', '⠤', '⠦', '⠆', '⠃', '⠋', '⠉'],
) {
  let x = 0;

  process.stdout.write(chars[x++] + ' ' + text);

  return setInterval(function () {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(chars[x++] + ' ' + text);
    x = x % chars.length;
  }, 10);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function clearLoading(_loading) {
  _loading && clearTimeout(_loading);
}

function isDirectory(_path) {
  const stat = fs.statSync(_path);

  return stat.isDirectory();
}

function parseFileName(_name) {
  return path.parse(_name).name.replace(/-/g, '_').replace(/ /g, '');
}

function matchFileExt(_name, _exts = []) {
  if (!_exts.length) {
    return true;
  }

  const ext = path.extname(_name).slice(1);

  if (!ext) {
    return false;
  }

  return _exts.includes(ext.toLowerCase());
}

function prettier(_path) {
  execSync(`npx prettier --write ${_path}`);
}

function getSubItems(_path) {
  if (!isDirectory(_path)) {
    return;
  }

  return fs.readdirSync(_path);
}

function createFolder(_path) {
  return fs.mkdirSync(_path, { recursive: true });
}

function createFile(_path, content = '') {
  return fs.writeFile(_path, content, () => {});
}

// execute
async function executeTask({ msg, task, wait = 100 }) {
  let _loading;
  let _result;

  try {
    _loading = spinLoading(msg);
    await delay(wait);
    log('\r');
    _result = await task(_loading);
  } catch (e) {
    log.warn(e.message);
  } finally {
    clearLoading(_loading);
  }

  return _result;
}

async function script() {
  // Read config
  const {
    isAllowContinue,
    assetFolderPath,
    resources,
    resourcesName,
    rootEntryPath,
  } = await executeTask({
    msg: 'Reading config...',
    task: () => {
      if (!Object.keys(config).length) {
        throw new Error('Config not found or something is weird. Please check');
      }

      const _assetFolderPath = path.resolve(
        WORKSPACE_PATH,
        config.srcFolderName,
        config.assetFolderName,
      );

      const _rootEntryPath = path.resolve(_assetFolderPath, 'index.ts');

      const _resourcesName = Object.keys(config.resources);
      if (!_resourcesName.length) {
        return { isAllowContinue: false };
      }

      log.done(
        `Assets folder path: ${config.srcFolderName}/${config.assetFolderName}`,
      );
      log.done(`Resouces: ${_resourcesName.join(' | ')}`);

      return {
        isAllowContinue: true,
        assetFolderPath: _assetFolderPath,
        resourcesName: _resourcesName,
        rootEntryPath: _rootEntryPath,
        resources: _resourcesName.map((resourceName) => {
          const res = config.resources[resourceName];

          return {
            name: resourceName,
            path: path.resolve(_assetFolderPath, resourceName),
            resourceFolderName: res.resourceFolderName,
            exts: res.exts,
            resourcePath: path.resolve(
              _assetFolderPath,
              resourceName,
              res.resourceFolderName,
            ),
            entryFilePath: path.resolve(
              _assetFolderPath,
              resourceName,
              'index.ts',
            ),
            handler: res.handler,
          };
        }),
      };
    },
  });

  if (!isAllowContinue) {
    log.warn('No resources defined in config');
    return;
  }

  // Check assets folder path
  await executeTask({
    msg: 'Check assets folder path...',
    task: () => {
      const _isAssetFolerExist = fs.existsSync(assetFolderPath);

      if (!_isAssetFolerExist) {
        log.warn('Assets folder is not exist');
        createFolder(assetFolderPath);
        log.done('Assets folder created');
      } else {
        log.done('Assets folder is exist');
      }
    },
  });

  // Analytics
  await executeTask({
    msg: 'Reading assets folder...',
    task: () => {
      const _dirs = [];

      const subItems = getSubItems(assetFolderPath);
      log.done(`${subItems.length} items found: ${subItems.join(', ')}`);

      subItems.forEach((item) => {
        const itemPath = path.resolve(assetFolderPath, item);

        if (isDirectory(itemPath)) {
          if (!resourcesName.includes(item)) {
            log.warn(`- ${item} (d) (not in config)`);
          } else {
            _dirs.push({ name: item, path: itemPath });
            log.done(`+ ${item} (d)`);
          }
        } else {
          log.warn(`- ${item} (f)`);
        }
      });
    },
  });

  let resCount = {};
  // Handle assets
  for (const res of resources) {
    await executeTask({
      msg: `Handling ${res.name} folder...`,
      task: () => {
        const isExist = fs.existsSync(res.path);

        if (!isExist) {
          log.done(`Create ${res.name} folder`);

          createFolder(res.path);
        } else {
          log.done(`Reading ${res.name} folder`);
        }

        const isEntryExist = fs.existsSync(res.entryFilePath);

        if (!isEntryExist) {
          log.done('Create entry file');
          const emptyFileContent = 'export {}';
          createFile(res.entryFilePath, emptyFileContent);
        }

        const isResourcesExist = fs.existsSync(res.resourcePath);

        if (!isResourcesExist) {
          log.done(`Create ${res.resourceFolderName} folder`);
          createFolder(res.resourcePath);
          return;
        } else {
          log.done(`Reading ${res.resourceFolderName} folder`);
        }

        const result = res.handler(res);
        resCount = { ...resCount, ...result };
      },
    });
  }

  // Rewrite root entry
  await executeTask({
    msg: 'Rewrite root entry file...',
    task: () => {
      const isExist = fs.existsSync(rootEntryPath);

      if (!isExist) {
        log.done('Creating index.ts file');
        createFile(rootEntryPath);
        return;
      } else {
        log.done('Reading index.ts file');
      }

      const importContent = resourcesName
        .map((name) => `import * as ${name} from './${name}';`)
        .join('\n');

      const content = `
      ${importContent}

      const R = {${resourcesName.join(',')}}

      export default R;
      `;

      fs.writeFileSync(rootEntryPath, content);
      prettier(rootEntryPath);

      log.special(
        `Total: ${Object.keys(resCount)
          .map((key) => `${resCount[key]} ${key}`)
          .join(' | ')}`,
      );
    },
  });
}

script();
