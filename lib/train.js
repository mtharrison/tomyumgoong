const tf = require('@tensorflow/tfjs-node');
const _ = require('lodash');
const Uuid = require('uuid');

const LoadData = require('./load-data');
const Model = require('./model');

const run = async () => {

    const model = Model();

    // Train model

    const { train, test } = await LoadData();

    const train_x = tf.tensor4d(_.flatten(train.x), [train.x.length, 100, 100, 3]);
    const train_y = tf.tensor2d(train.y, [train.y.length, 1]);

    await model.fit(train_x, train_y, { epochs: 10, batchSize: 1 });

    // Evaluate model

    const test_x = tf.tensor4d(_.flatten(test.x), [test.x.length, 100, 100, 3]);
    const test_y = tf.tensor2d(test.y, [test.y.length, 1]);

    const result = model.evaluate(test_x, test_y);
    console.log(`Evaluation result:\nLoss = ${result[0].dataSync()[0].toFixed(3)}; Accuracy = ${result[1].dataSync()[0].toFixed(3)}`);

    // Save model

    await model.save(`file://out/${new Date().toISOString()}`);
};

run();