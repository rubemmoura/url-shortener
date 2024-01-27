#!/usr/bin/env node

const child_process = require("child_process");
const util = require("util");
const exec = util.promisify(child_process.exec);

const yargs = require("yargs");
const replaceInFiles = require("replace-in-files");

const argv = yargs
    .usage("Usage\n\n  url-shortener <name>")
    .epilog("Copyright @ 2019").argv;

const name = argv._[0];
const package =
    "https://github.com/piecioshka/url-shortener/archive/master.zip";

if (!name) {
    yargs.showHelp();
    process.exit(1);
}

const options = {
    files: [
        `${name}/README.md`,
        `${name}/package.json`,
        `${name}/package-lock.json`,
        `${name}/bin/cli.js`,
    ],
    from: /url-shortener/g,
    to: name,
};

async function isFileExist(name) {
    try {
        await exec(`stat ${name}`);
        return true;
    } catch (ignore) {
        // console.log(ignore);
        return false;
    }
}

const log = (text) => console.info("[+] " + text);
const fail = (text) => console.error("[-] " + text);

function task(command) {
    log("Command: " + command);
    return exec(command);
}

(async () => {
    log(`Create project: ${name}`);
    try {
        const isDirectoryExist = await isFileExist(name);
        if (isDirectoryExist) {
            throw new Error(`Directory exist - ${name}`);
        }
        // Fetch github.com/piecioshka/url-shortener
        await task(`wget ${package} -O url-shortener.zip`);
        await task(`unzip url-shortener.zip`);
        await task(`mv url-shortener-master ${name}`);
        await task(`rm -rf url-shortener.zip`);
        // Replace all "url-shortener" by "NAME"
        await replaceInFiles(options);
        // Git setup & commit
        await task(
            `cd ${name} && git init && git add . && git commit -am "Generate project"`
        );
        log("Project created");
    } catch (reason) {
        fail(`Project does not created properly: ${reason.message}`);
    }
})();
