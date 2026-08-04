import TicketlessLogo from '../assets/Tickectless.svg';

function Navbar(){
    return(
        <nav>
            <div className="logo">
                <div className="logo-icon">
                    <img src={TicketlessLogo} alt="Ticketless Parking Logo" />
                </div>
                <h2>Ticketless Parking System</h2>
            </div>

            <ul>
                <li><a href="#hero">Home</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;