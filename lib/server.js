const Hapi = require('hapi');
const Path = require('path');
const Sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');

const MODEL_NAME = '2019-02-13T11:10:12.412Z';

const start = async () => {

    // Load then tensorflow model

    const model = await tf.loadModel(`file://${Path.join(__dirname, '../out', MODEL_NAME, 'model.json')}`);

    const server = Hapi.server({ port: 3000 });

    await server.register(require('inert'));

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {

            return h.file(Path.join(__dirname, 'index.html'));
        }
    });

    server.route({
        method: 'POST',
        path: '/predict',
        handler: async function (request, h) {

            try {
                const buffer = request.payload.file;
                const bufferResized = await Sharp(buffer).resize(100, 100).removeAlpha().raw().toBuffer({ resolveWithObject: true });
                const x = Array.from(new Uint8Array(bufferResized.data)).map((x) => x / 255);

                const prediction = model.predict(tf.tensor4d(x, [1, 100, 100, 3]));

                const p = await prediction.data();

                const result = `<pre>Tom Yum Goong: ${p[0] * 100}%\nTom Ka Gai: ${p[1] * 100}%</pre>`;

                return result;
            } catch(err) {
                console.log(err);
            }
            
        }
    });

    await server.start();

    console.log(`Server listening on ${server.info.uri}`);
};

start();