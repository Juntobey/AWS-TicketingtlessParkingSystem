
function Hero(){

    return(
        <section id="hero" className="hero">
        <div className="hero-content">
            <h1>Ticketless Parking System</h1>
            <p className="hero-tagline">Effortless parking, zero tickets.</p>
            <p className="hero-subtitle">Upload a vehicle image to process parking sessions and monitor parking activity.</p>

            <a href="#upload">
                <button>Process Vehicle</button>
            </a>
        </div>
        </section>
    )
}

export default Hero;