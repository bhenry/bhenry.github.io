class NotFound extends React.Component {
    render() {
        return (
            <div>
                <Headline text="Page Not Found" />
                <p>{this.props.url}</p>
            </div>
        )
    }
}
