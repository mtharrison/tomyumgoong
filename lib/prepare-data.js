const Fs = require('fs');
const Path = require('path');
const Sharp = require('sharp');
const Rimraf = require('rimraf');

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

const BASE_DATA_DIR = Path.join(__dirname, 'data');
const SOURCE_DIR = Path.join(__dirname, 'food');
const TRAIN_DIR = Path.join(BASE_DATA_DIR, 'train');
const TEST_DIR = Path.join(BASE_DATA_DIR, 'test');

function shuffle(array) {

    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const prepare = async () => {

    // Create required directories

    Rimraf.sync(TRAIN_DIR);
    Rimraf.sync(TEST_DIR);

    Fs.mkdirSync(TRAIN_DIR);
    Fs.mkdirSync(TEST_DIR);

    // Read all the source data

    const positive = shuffle(Fs.readdirSync(Path.join(SOURCE_DIR, 'tkk'))
        .filter((name) => name.match(/(\.jpeg|\.png|\.jpg)/)));

    const negative = shuffle(Fs.readdirSync(Path.join(SOURCE_DIR, 'tyg'))
        .filter((name) => name.match(/(\.jpeg|\.png|\.jpg)/)));

    // Prepare training data

    const positiveTrain = positive.slice(0, Math.floor(positive.length * 0.7)).map((file) => ({
        label: 1,
        path: Path.join(SOURCE_DIR, 'tkk', file)
    }));

    const negativeTrain = negative.slice(0, Math.floor(negative.length * 0.7)).map((file) => ({
        label: 0,
        path: Path.join(SOURCE_DIR, 'tyg', file)
    }));

    const trainingData = shuffle([...positiveTrain, ...negativeTrain]);

    const trainLabels = {};
    let i = 0;

    for (const item of trainingData) {
        const buffer = Fs.readFileSync(item.path);
        const name = `${pad(i, 3)}.jpg`;
        await Sharp(buffer).resize(180, 180).toFile(Path.join(TRAIN_DIR, name));
        trainLabels[name] = item.label;
        ++i;
    }

    Fs.writeFileSync(Path.join(TRAIN_DIR, 'labels.json'), JSON.stringify(trainLabels, null, 2));

    // Prepare test data

    const positiveTest = positive.slice(Math.floor(positive.length * 0.7)).map((file) => ({
        label: 1,
        path: Path.join(SOURCE_DIR, 'tkk', file)
    }));

    const negativeTest = negative.slice(Math.floor(negative.length * 0.7)).map((file) => ({
        label: 0,
        path: Path.join(SOURCE_DIR, 'tyg', file)
    }));

    const testData = shuffle([...positiveTest, ...negativeTest]);

    const testLabels = {};
    i = 0;

    for (const item of testData) {
        const buffer = Fs.readFileSync(item.path);
        const name = `${pad(i, 3)}.jpg`;
        await Sharp(buffer).resize(180, 180).toFile(Path.join(TEST_DIR, name));
        testLabels[name] = item.label;
        ++i;
    }

    Fs.writeFileSync(Path.join(TEST_DIR, 'labels.json'), JSON.stringify(testLabels, null, 2));
};

prepare();