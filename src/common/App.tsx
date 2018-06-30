import * as React from 'react';
import { hot } from 'react-hot-loader';

import appStyles from './app.css';

const css = __BROWSER__ ? appStyles.locals : appStyles;

class App extends React.Component {
    public render() {
        if (__BROWSER__) {
            appStyles.use();
        }

        return (
            <>
                <p className={css.hello}>Hello World!</p>
            </>
        );
    }
}

export default (__DEV__ ? hot(module)(App) : App);
