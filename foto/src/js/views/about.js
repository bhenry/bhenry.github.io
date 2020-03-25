class About extends React.Component {
    render() {
        return (
            <div>
                <Headline text="About" />
                <p>{this.props.url}</p>
                <p>{this.props.id}</p>
            </div>
        )
    }
}
