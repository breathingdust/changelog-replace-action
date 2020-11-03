const core = require('@actions/core');
const { promises: fs } = require('fs')

async function main() {
  const path = core.getInput('path');
  const changelog = process.env.CHANGELOG;

  let content = '';
  try {
    content = await fs.readFile(path, 'utf8');
  } catch (error) {
    core.setFailed(error.message);
  }

  const regex = /(?<before>^## \d+.\d+.\d+ \(Unreleased\)\n\n)[\s\S]+(?<after>\n\n## \d+.\d+.\d+)/gm

  let result = content.replace(regex, (...match) => {
    let groups = match.pop();
    return `${groups.before}${changelog}${groups.after}`;
  });

  try {
    await fs.writeFile(path, result, 'utf8');
  } catch (error) {
    core.setFailed(error.message);
  }
}

try {
  main();
} catch (error) {
  core.setFailed(error.message);
}
