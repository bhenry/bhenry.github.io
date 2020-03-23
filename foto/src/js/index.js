'use strict';

const e = React.createElement;

class App extends React.Component {
    readURL() {
        var path = location.href && location.href.split("#")[1];
        var parts = path && path.split("/");
        parts && !parts[parts.length - 1] && parts.pop();
        parts && !parts[0] && parts.shift();
        return parts;
    }
    match(path, matcher) {
        var path_params = {}
        for (var i = 0; i < matcher.length; i++) {
            if (matcher[i].startsWith("?")){
                path_params[matcher[i].substring(1)] = path[i];
            } else if (matcher[i] !== path[i]) {
                return false;
            }
        }
        console.log(path_params);
        path_params["codeWord"] = "wtf";
        return path_params;
    }
    constructor(props) {
        super(props);
        this.state = {
            path: this.readURL()
        };
    }
    componentDidMount(props) {
        window.onhashchange = () => {
            this.setState({
                path: this.readURL()
            });
       };
    }
    render() {
        if (this.match(this.readURL(), ["home"])) {
            return (
                <div>home</div>
            )
        } else {
            return (
                <div>Not found</div>
            )
        }
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(e(App), domContainer);

