const Hapi = require('hapi');
const Path = require('path');
const Sharp = require('sharp');
const tf = require('@tensorflow/tfjs-node');

const MODEL_NAME = '2019-02-14T01:11:01.647Z';

const start = async () => {

    // Load then tensorflow model

    const model = await tf.loadModel(`file://${Path.join(__dirname, '../out', MODEL_NAME, 'model.json')}`);

    const server = Hapi.server({ port: 3000, routes: { payload: { maxBytes: 10e6, timeout: false } } });

    await server.register(require('inert'));
    await server.register(require('vision'));

    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'templates',
        isCached: false,
        layout: true
    });

    server.route({
        method: 'GET',
        path: '/',
        handler: function (request, h) {

            return h.view('index');
        }
    });

    server.route({
        method: 'POST',
        path: '/predict',
        handler: async function (request, h) {

            const buffer = request.payload.file;
            const bufferResized = await Sharp(buffer).resize(100, 100).removeAlpha().raw().toBuffer({ resolveWithObject: true });

            const x = Array.from(new Uint8Array(bufferResized.data)).map((x) => x / 255);
            const p = await model.predict(tf.tensor4d(x, [1, 100, 100, 3])).data();

            console.log(p);

            const predictions = [
                { name: 'Tom Yum Goong', p: p[0] * 100, pClean: (p[0] * 100).toFixed(2) + '%' },
                { name: 'Tom Kha Gai', p: p[1] * 100, pClean: (p[1] * 100).toFixed(2) + '%' },
                { name: 'Larb Moo', p: p[2] * 100, pClean: (p[2] * 100).toFixed(2) + '%' },
            ].sort((a, b) => b.p - a.p);

            const base64 = (await Sharp(buffer).resize(300, 300).jpeg().toBuffer()).toString('base64');

            return h.view('result', { base64, predictions });
        }
    });

    await server.start();

    console.log(`Server listening on ${server.info.uri}`);
};

start();