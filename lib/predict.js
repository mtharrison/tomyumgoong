const Fs = require('fs');
const Path = require('path');
const Sharp = require('sharp');
const _ = require('lodash');
const tf = require('@tensorflow/tfjs-node');

const run = async () => {

    // Load model

    const model = await tf.loadModel('file://model/model.json');

    // Load the file

    const files = Fs.readdirSync(Path.join(__dirname, 'data/test'));

    for (const file of files) {
        const res = await Sharp(Fs.readFileSync(Path.join(__dirname, 'data/test', file))).raw().toBuffer({ resolveWithObject: true });
        const pixels = Array.from(new Uint8Array(res.data)).map((x) => x / 255);
        const x = tf.tensor4d(_.flatten(pixels), [1, 200, 200, 3]);
        console.log(file);
        model.predict(x, { batchSize: 1, verbose: true }).print();
    }
    
};

run();
