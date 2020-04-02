class Router extends React.Component {
    match(matcher) {
        var path = this.state.path;
        var params = { url: location.href };
        for (let i = 0; i < matcher.length; i++) {
            if (matcher[i].startsWith("?")) {
                params[matcher[i].substring(1)] = path[i];
            } else if (matcher[i] === "...") {
                params["path"] = path.slice(i);
                return params;
            } else if (matcher[i] !== path[i]) {
                return false;
            }
        }
        return params;
    }
    resolve() {
        for (let i = 0; i < this.routes.length; i++) {
            let [matcher, view] = this.routes[i];
            let params = this.match(matcher);
            if (params) {
                return [view, params];
            }
        }
        return [NotFound, {url: location.href}];
    }
    render() {
        var [view, props] = this.resolve();
        return React.createElement(view, props);
    }
}
