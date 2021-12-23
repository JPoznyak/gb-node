const fs = require('fs/promises');
const path = require('path');
const inquirer = require('inquirer');
const {lstatSync} = require('fs');
const yargs = require('yargs');

let currentDirectory = process.cwd();
const options = yargs
    .option('dir', {
        describe: 'Path to directory',
        default: process.cwd(),
    })
    .option('file', {
        describe: 'Path to file',
        default: '',
    }).argv;
console.log(options);

class ListItem {
    constructor(path, fileName) {
        this.path = path;
        this.fileName = fileName;
    }

    get isDir() {
        return lstatSync(this.path).isDirectory();
    }
}

const showContent = async () => {
    const fileList = await fs.readdir(currentDirectory);
    const items = fileList.map(fileName =>
        new ListItem(path.join(currentDirectory, fileName), fileName));

    const item = await inquirer
        .prompt([
            {
                name: 'fileName',
                type: 'list',
                message: `Choose a file`,
                choices: items.map(item => ({name: item.fileName, value: item})),
            }
        ])
        .then(answer => answer.fileName);

    if (item.isDir) {
        currentDirectory = item.path;
        return await showContent();
    } else {
        const data = await fs.readFile(item.path, 'utf-8');

        if (!options.file) console.log(data);
        else {
            const regExp = new RegExp(options.file, 'igm');
            console.log(data.match(regExp));
        }
    }
}

showContent();

