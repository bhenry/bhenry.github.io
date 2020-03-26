const routes = [
    [["home"], Home],
    [["about"], About],
    [["about", "?id"], About],
    [["games", "..."], Games]
];

class App extends Router {
    readPath() {
        var path = location.href && location.href.split("#")[1];
        var parts = path && path.split("/");
        parts && !parts[parts.length - 1] && parts.pop();
        parts && !parts[0] && parts.shift();
        return parts || this.props.root;
    }
    constructor(props) {
        super(props);
        this.state = {
            path: this.readPath()
        };
        this.routes = routes;
        this.root = ["home"];
    }
    componentDidMount(_) {
        window.onhashchange = () => {
            this.setState({
                path: this.readPath()
            });
       };
    }
}

const domContainer = document.querySelector('#root');
ReactDOM.render(React.createElement(App), domContainer);
