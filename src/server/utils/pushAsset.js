import path from 'path';
import http2 from 'http2';

import serverRoot from './serverRoot';
import respondToStreamError from './respondToStreamError';

const { HTTP2_HEADER_PATH } = http2.constants;

const pushAsset = (stream, file) => {
    stream.pushStream({ [HTTP2_HEADER_PATH]: file.path }, { parent: stream.id }, (err, pushStream) => {
        if (err) {
            console.log('>> Pushing error:', err);

            return;
        }

        console.log('>> Pushing:', file.path);

        pushStream.on('error', err => respondToStreamError(err, pushStream));

        const absFilePath = path.resolve(path.join(serverRoot, file.filePath));

        try {
            pushStream.respondWithFile(absFilePath, file.headers);
        } catch (err) {
            console.log('pushing error', err);
        }
    });
};

export default pushAsset;
