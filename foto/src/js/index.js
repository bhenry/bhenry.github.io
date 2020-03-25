'use strict';

const e = React.createElement;

const matchers = [
    [[], Home],
    [["home"], Home],
    [["about"], About],
    [["about", "?id"], About]
];

class App extends React.Component {
    readPath() {
        var path = location.href && location.href.split("#")[1];
        var parts = path && path.split("/");
        parts && !parts[parts.length - 1] && parts.pop();
        parts && !parts[0] && parts.shift();
        return parts || [];
    }
    match(matcher) {
        var path = this.state.path;
        var params = { url: location.href };
        if (path.length !== matcher.length) {
            return false;
        }
        for (let i = 0; i < matcher.length; i++) {
            if (matcher[i].startsWith("?")){
                params[matcher[i].substring(1)] = path[i];
            } else if (matcher[i] !== path[i]) {
                return false;
            }
        }
        return params;
    }
    resolve() {
        for (let i = 0; i < matchers.length; i++) {
            let [matcher, view] = matchers[i];
            let params = this.match(matcher);
            if (params) {
                return [view, params];
            }
        }
        return [NotFound, {url: location.href}];
    }
    constructor(props) {
        super(props);
        this.state = {
            path: this.readPath()
        };
    }
    componentDidMount(props) {
        window.onhashchange = () => {
            this.setState({
                path: this.readPath()
            });
       };
    }
    render() {
        var [view, props] = this.resolve();
        return e(view, props);
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);

