import { Link} from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PlacesPage(){
    const [places, setPlaces] = useState([]);
    useEffect(() => {
        axios.get('/places').then(({data}) => {
            setPlaces(data);
        })
    }, []);
    return (
        <div>
            <AccountNav />
            <div className="text-center">
                <Link className="inline-flex gap-1 px-6 py-2 mt-6 text-white rounded-full bg-primary" to={'/account/places/new'}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add new place
                </Link>
            </div>
            <div className="mt-4">
                {places.length > 0 && places.map(place =>(
                    <Link to={'/account/places/' + place._id}>
                        <div className="flex gap-4 p-4 bg-gray-100 cursor-pointer rounded-2xl" key={place._id}>  
                            <div className="w-32 h-32 bg-gray-300 grow shrink-0">
                                {place.photos.length && (
                                    <img src={place.photos[0]} />
                                )}
                            </div>
                            <div className="">
                                <h2 className="text-xl">{place.title}</h2>
                                <p className="text-sm">{place.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}