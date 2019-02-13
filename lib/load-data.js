const Fs = require('fs');
const Path = require('path');
const Sharp = require('sharp');

const BASE_DATA_DIR = Path.join(__dirname, '../data');
const TRAIN_DIR = Path.join(BASE_DATA_DIR, 'train');
const TEST_DIR = Path.join(BASE_DATA_DIR, 'test');

const load = async () => {

    const result = {
        train: {
            x: [],
            y: []
        },
        test: {
            x: [],
            y: []
        }
    };

    const trainLabels = require(Path.join(TRAIN_DIR, 'labels.json'));
    const trainingFiles = Fs.readdirSync(TRAIN_DIR).filter((name) => name.match(/\.jpg/));

    for (const file of trainingFiles) {
        const res = await Sharp(Fs.readFileSync(Path.join(TRAIN_DIR, file))).raw().toBuffer({ resolveWithObject: true });
        const data = Array.from(new Uint8Array(res.data)).map((x) => x / 255);
        
        result.train.x.push(data);
        result.train.y.push(trainLabels[file].label);
    }

    const testLabels = require(Path.join(TEST_DIR, 'labels.json'));
    const testFiles = Fs.readdirSync(TEST_DIR).filter((name) => name.match(/\.jpg/));

    for (const file of testFiles) {
        const res = await Sharp(Fs.readFileSync(Path.join(TEST_DIR, file))).raw().toBuffer({ resolveWithObject: true });
        const data = Array.from(new Uint8Array(res.data)).map((x) => x/255);
        
        result.test.x.push(data);
        result.test.y.push(testLabels[file].label);
    }

    return result;
};

module.exports = load;