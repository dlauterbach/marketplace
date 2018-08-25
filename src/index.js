import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
//import 'bootstrap/dist/js/bootstrap.min.js'
import React from 'react';
import ReactDOM from 'react-dom';
//import { render } from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/*
const App = () => (
    <div>
        <br />
        <div className="container">
            <div className="row">
                <div className="col-sm">
                One of three columns
                </div>
                <div className="col-sm">
                One of three columns
                </div>
                <div className="col-sm">
                One of three columns
                </div>
            </div>
        </div>
    </div>
);
*/

//render(<App />, document.getElementById('root'));
ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
