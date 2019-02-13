const tf = require('@tensorflow/tfjs-node');
const _ = require('lodash');

const LoadData = require('./load-data');
const Model = require('./model');

const run = async () => {

    const model = Model();

    const { train, test } = await LoadData();

    const train_x = tf.tensor4d(_.flatten(train.x), [train.x.length, 200, 200, 3]);
    const train_y = tf.tensor2d(train.y, [train.y.length, 1]);

    await model.fit(train_x, train_y, { epochs: 20, batchSize: 1 });

    // // // Evaluate

    // // console.log(`Evaluating model...`);

    // // console.log('Building tensors...');

    // const test_x = tf.tensor4d(_.flatten(test.x), [test.x.length, 180, 180, 3]);
    // const test_y = tf.tensor2d(test.y, [test.y.length, 1]);

    // // console.log('Evaluating...');

    // // model.predict(test_x).print();

    // const model = await tf.loadModel('file://model/model.json');

    // model.compile({
    //     optimizer,
    //     loss: 'sparseCategoricalCrossentropy',
    //     metrics: ['accuracy'],
    // });

    // const result = model.evaluate(test_x, test_y);
    // console.log(
    //     `\nEvaluation result:\n` +
    //     `  Loss = ${result[0].dataSync()[0].toFixed(3)}; `+
    //     `Accuracy = ${result[1].dataSync()[0].toFixed(3)}`);


    // let i = 0;

    // for (let item of test.x) {
    //     const res = model.predict(tf.tensor4d(item, [1, 180, 180, 3]));
    //     const p = await res.data();

    //     if (p[0] > p[1]) {
    //         console.log(`Image ${i} is Tom Yum Goong with probability ${(p[0] * 100).toFixed(2)}%`);
    //     }
    //     else {
    //         console.log(`Image ${i} is Tom Kha Gai with probability ${(p[1] * 100).toFixed(2)}%`);
    //     }

    //     ++i;
    // }

    // await model.save('file://model');
};

run();