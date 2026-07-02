import Navbar from "./Navbar";
import "../styles/layout.css";

function Layout({ children }) {
    return (
        <>
            <Navbar />

            <main className="layout-content">
                {children}
            </main>
        </>
    );
}

export default Layout;