import './App.css';
import {useEffect, useState} from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import {ClipLoader} from "react-spinners";
import {ToastContainer, toast} from "react-toastify";

function App() {
    const [search, setSearch] = useState('');
    const [shows, setShows] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filteredShows, setFilteredShows] = useState([]);
    const [selectedShowId, setSelectedShowId] = useState(null);
    const [selectedShowDetails, setSelectedShowDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (search) {
            setIsLoading(true);
            fetchShows();
        } else {
            setShows([]);
            setGenres([]);
            setFilteredShows([]);
            setSelectedShowId(null);
            setSelectedShowDetails(null);
        }

        async function fetchShows() {
            try {
                const response = await axios.get('http://localhost:3000/shows', {params: {search}});
                const showsResponse = response.data;
                setShows(showsResponse)
                const genresResponse = new Set(showsResponse.flatMap(show => show.genres))
                setGenres(Array.from(genresResponse));
            } catch (err) {
                toast('Something went wrong! please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [search]);


    useEffect(() => {
        if (selectedShowId) {
            setIsLoading(true);
            fetchShowDetails();
        } else {
            setSelectedShowDetails(null);
        }

        async function fetchShowDetails() {
            try {
                const response = await axios.get(`http://localhost:3000/shows/${selectedShowId}`);
                setSelectedShowDetails(response.data)
            } catch (err) {
                toast('Something went wrong! please try again later.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [selectedShowId]);

    const handleSearchChange = event => {
        setSearch(event.target.value);
    };

    const filterShows = (genre) => {
        setFilteredShows(shows.filter(show => show.genres.includes(genre)));
        setSelectedShowId(null)
    }

    const renderSelectedShowDetails = () => {
        const {status, language, type, summary} = selectedShowDetails;
        return (<>
            <h3>
                Show details:
            </h3>
            <div className="show-details">
                {status ? <p>Status: {status}</p> : null}
                {language ? <p>Language: {language}</p> : null}
                {type ? <p>Type: {type}</p> : null}
                {summary ? <div>Summary: <div dangerouslySetInnerHTML={{__html: summary}}/></div> : null}
            </div>
        </>)
    }


    return (<>
            {isLoading && <div className="spinner">
                <ClipLoader loading={isLoading}/>
            </div>}
            <div className="layout">
                <div>
                    <input
                        className="search-input"
                        type="text"
                        placeholder="type to search"
                        onChange={debounce(handleSearchChange, 500)}
                    />
                </div>
                {genres.length
                    ? <div>
                        <h3>Genres:</h3>
                        <ul className="list">
                            {genres.map(genre => (
                                <li className="list-item" key={genre} onClick={() => filterShows(genre)}>
                                    {genre}
                                </li>
                            ))}
                        </ul>
                    </div>
                    : null
                }
                {filteredShows.length
                    ? <>
                        <h3>Shows:</h3>
                        <div>
                            <ul className="list">
                                {filteredShows.map(show => (
                                    <li className="list-item" key={show.id} onClick={() => setSelectedShowId(show.id)}>
                                        {show.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                    : null
                }
                {selectedShowDetails && renderSelectedShowDetails()}
            </div>
            <ToastContainer/>
        </>
    );
}

export default App;
