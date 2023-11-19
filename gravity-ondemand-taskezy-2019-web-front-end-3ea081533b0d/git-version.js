
const getRepoInfo =  require('git-repo-info');
const { resolve, relative } = require('path');
const { writeFileSync, existsSync, mkdirSync } = require('fs-extra');

const gitInfo = getRepoInfo();
if(gitInfo.tag) {
    gitInfo.version = gitInfo.tag;
} else {
    gitInfo.version = `${gitInfo.lastTag}-${gitInfo.commitsSinceLastTag}-${gitInfo.abbreviatedSha}`;
}

if (!existsSync(__dirname + '/src/environments')) {
    mkdirSync(__dirname + '/src/environments');
}
const file = resolve(__dirname, 'src', 'environments', 'version.ts');
writeFileSync(file,
    `// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* eslint-disable */
export const VERSION: any = ${JSON.stringify(gitInfo, null, 4)};
/* eslint-enable */
`, { encoding: 'utf-8' });
console.log(gitInfo);
console.log(`Wrote version info ${gitInfo.sha} to ${relative(resolve(__dirname, '..'), file)}`);
