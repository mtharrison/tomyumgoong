const tf = require('@tensorflow/tfjs-node');

const Config = require('./config');

module.exports = function () {

    // Construct model architecture

    const model = tf.sequential();

    model.add(tf.layers.flatten({ inputShape: [Config.size, Config.size, 3] }));
    model.add(tf.layers.dense({ units: 1000, activation: 'relu' }));
    model.add(tf.layers.dense({ units: 2, activation: 'softmax' }));

    // Compile model

    const optimizer = tf.train.adam(0.00001);

    model.compile({
        optimizer,
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};