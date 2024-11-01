import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";
import PlaceGallery from "../PlaceGallery";
import AddressLink from "../AddressLink";

export default function PlaceDetailPage(){
    const {id} = useParams();
    const [place, setPlace] = useState(null);

    useEffect(() =>{
        if(!id){
            return;
        }
        axios.get('/places/' + id).then((response) =>{
            setPlace(response.data);
        });
    }, [id]);

    if(!place) return "";

    

    return(
        <div className="px-8 pt-8 mt-4 -mx-8 bg-gray-100">
            <h1 className="text-3xl">{place.title}</h1>

            <AddressLink children={place.address} /> 
            
            <PlaceGallery place={place} />
            
            <div className="grid mb-8 grid-cols-1 md:grid-cols-[2fr_1fr] mt-8 gap-8">
                <div>
                    <div className="my-4">
                        <h2 className="text-2xl font-semibold">Description</h2>
                        {place.description}
                    </div>
                    Check-in: {place.checkIn} <br />
                    Check-out: {place.checkOut} <br />
                    Max number of guests: {place.maxGuests}
                </div>
                <div>
                    <BookingWidget place={place} />
                </div>
            </div>
            <div className="px-8 py-8 -mx-8 bg-white border-t">
                <div>
                    <h2 className="text-2xl font-semibold">Extra Info</h2>
                </div>
                <div className="mt-2 mb-4 text-sm leading-5 text-gray-700">{place.extraInfo}</div>
            </div>

        </div>
    );
}