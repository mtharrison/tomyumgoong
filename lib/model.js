const tf = require('@tensorflow/tfjs-node');

module.exports = function () {

    // Construct model architecture

    const model = tf.sequential();

    model.add(tf.layers.flatten({ inputShape: [100, 100, 3] }));
    model.add(tf.layers.dense({ units: 5000, activation: 'relu' }));

    // model.add(tf.layers.conv2d({ 
    //     kernelInitializer: 'varianceScaling', 
    //     kernelSize: 5, 
    //     inputShape: [200, 200, 3], 
    //     filters: 20, 
    //     activation: 'relu' 
    // }));

    // model.add(tf.layers.maxPooling2d({ 
    //     poolSize: [2,2], 
    //     strides: [2,2] 
    // }));

    // model.add(tf.layers.flatten());

    // model.add(tf.layers.dense({
    //     units: 4000, 
    //     activation: 'relu' 
    // }));

    // model.add(tf.layers.dense({
    //     units: 1000, 
    //     activation: 'relu' 
    // }));

    model.add(tf.layers.dense({
        units: 3, 
        activation: 'softmax' 
    }));

    // Compile model

    const learningRate = 0.0001;
    const optimizer = tf.train.sgd(learningRate);

    model.compile({
        optimizer,
        loss: 'sparseCategoricalCrossentropy',
        metrics: ['accuracy'],
    });

    return model;
};