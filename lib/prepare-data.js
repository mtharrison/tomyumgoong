const Fs = require('fs');
const Path = require('path');
const Sharp = require('sharp');
const Rimraf = require('rimraf');
const Utils = require('./utils');

const BASE_DATA_DIR = Path.join(__dirname, '../data');
const SOURCE_DIR = Path.join(BASE_DATA_DIR, 'source');
const TRAIN_DIR = Path.join(BASE_DATA_DIR, 'train');
const TEST_DIR = Path.join(BASE_DATA_DIR, 'test');

const IMG_PATTERN = /(\.jpeg|\.png|\.jpg)/;
const TEST_TRAIN_RATIO = 0.8

const autolabel = (name) => {

    if (name.includes('tyg')) {
        return 0;
    }

    if (name.includes('tkg')) {
        return 1;
    }

    if (name.includes('lm')) {
        return 2;
    }

    throw new Error(`Bad name: ${name}`);
};

const prepare = async () => {

    // Create required directories

    Rimraf.sync(TRAIN_DIR);
    Rimraf.sync(TEST_DIR);

    Fs.mkdirSync(TRAIN_DIR);
    Fs.mkdirSync(TEST_DIR);

    // Read all the source data

    const source = Utils.shuffle(Fs.readdirSync(SOURCE_DIR).filter((name) => name.match(IMG_PATTERN)));

    // Prepare training data

    const trainingSize = Math.floor(source.length * TEST_TRAIN_RATIO);

    const training = source.slice(0, trainingSize + 1);
    const testing = source.slice(trainingSize + 1);

    let i = 0;
    const trainingLabels = {};

    for (const file of training) {
        const buffer = Fs.readFileSync(Path.join(SOURCE_DIR, file));
        const name = `${Utils.pad(i, 3)}.jpg`;
        await Sharp(buffer).resize(100, 100).toFile(Path.join(TRAIN_DIR, name));
        trainingLabels[name] = { label: autolabel(file), orig: file };
        ++i;
    }

    Fs.writeFileSync(Path.join(TRAIN_DIR, 'labels.json'), JSON.stringify(trainingLabels, null, 2));

    i = 0;
    const testLabels = {};

    for (const file of testing) {
        const buffer = Fs.readFileSync(Path.join(SOURCE_DIR, file));
        const name = `${Utils.pad(i, 3)}.jpg`;
        await Sharp(buffer).resize(100, 100).toFile(Path.join(TEST_DIR, name));
        testLabels[name] = { label: autolabel(file), orig: file };
        ++i;
    }

    Fs.writeFileSync(Path.join(TEST_DIR, 'labels.json'), JSON.stringify(testLabels, null, 2));
};

prepare();