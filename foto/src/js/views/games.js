const routes = [
    [["about"], About],
    [["..."], About],
];

class Games extends Router {
    constructor(props) {
        super(props);
        this.state = {
            path: props.path
        };
        this.routes = routes;
        this.root = ["about"];
    }
}
