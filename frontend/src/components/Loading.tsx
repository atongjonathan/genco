import loading from "../assets/loading-io.gif";

const Loading = () => {
    return (
        <div id="preloader">
            <img className="load" src={loading} alt="Loading" aria-label="Loading" />
        </div>
    )
}

export default Loading
