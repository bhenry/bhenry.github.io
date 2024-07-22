class Headline extends React.Component {
    render() {
        return (
            <h1>{this.props.text || "<provide text prop>"}</h1>
        )
    }
}
