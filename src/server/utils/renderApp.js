// @flow
import * as React from 'react';
import { renderToNodeStream } from 'react-dom/server';

import env from '../../utils/env';
import App from '../../common/App';

const headers = { 'content-type': 'text/html; charset=utf-8' };
const preLoadingResources = [
    '</default.css>; rel="preload"; as="style";',
    // `<${env.STATIC_URL}client.js>; rel="preload"; as="script";`,
];

function renderApp(req: Object, res: Object) {
    console.log('>> Render app');

    const isHttp2 = req.httpVersion.startsWith('2.');

    // preload should not be used with push
    if (isHttp2 === false) {
        headers['Link'] = preLoadingResources.join(',');
    }

    res.writeHead(200, headers);
    res.write(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="theme-color" content="#E6492F">
            <link rel="manifest" href="/manifest.json">
            <title>React SSR project</title>
            <meta name="Description" content="Simple SSR React project.">
            <meta http-equiv="Accept-CH" content="DPR, Viewport-Width, Width, Downlink">
            <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes">
            <link rel="stylesheet" type="text/css" href="/default.css" />
        </head>
        <body>
            <div id="app">`);

    const appStream = renderToNodeStream(<App />);

    appStream.on('end', () => {
        res.end(`</div>
            <script src="${env.STATIC_URL}client.js" defer></script>
        </body>
        <html>`);
    });

    appStream.pipe(
        res,
        { end: false },
    );
}

export default renderApp;
