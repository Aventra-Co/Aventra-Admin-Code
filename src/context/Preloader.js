import { createContext, useState, useEffect } from "react";
import PulseLoader from "react-spinners/PulseLoader";
import { APP_PREFIX_PATH } from "../constant/constant";
import logo from '../assets/img/Frame 1707480072.png';
import pattern from '../assets/img/pattern.webp';

export const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => { setLoading(false) }, 1000);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading }}>
            {loading ?
                <div className="mc-spinner">
                    <img className="pattern" src={logo} alt="pattern" />
                    <img className="favicon" src={logo} alt="logo" />
                    <div className="mc-spinner-group">
                        <h3>Loading</h3>
                        <PulseLoader
                            color="#0857f5"
                            loading={loading}
                            size={8}
                        />
                    </div>
                </div>
                :
                children
            }
        </LoaderContext.Provider>
    )
}