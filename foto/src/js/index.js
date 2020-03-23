'use strict';

const e = React.createElement;

class App extends React.Component {
    render() {
        return (
            <div>Goodbye</div>
        )
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);

