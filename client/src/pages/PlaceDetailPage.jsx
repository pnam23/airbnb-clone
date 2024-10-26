import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BookingWidget from "../BookingWidget";

export default function PlaceDetailPage(){
    const {id} = useParams();
    const [place, setPlace] = useState(null);
    const [showAllPhotos, setShowAllPhotos] = useState(false);

    useEffect(() =>{
        if(!id){
            return;
        }
        axios.get('/places/' + id).then((response) =>{
            setPlace(response.data);
        });
    }, [id]);

    if(!place) return "";

    if(showAllPhotos){
        return (
            <div className="absolute inset-0 min-h-screen text-white bg-black">
                <div className="grid gap-4 p-8 bg-black">
                    <div>
                        <button onClick={() => setShowAllPhotos(false)} className="fixed flex px-4 py-1 text-black bg-gray-100 rounded-full right-12 top-8 shadow-black">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                            Close
                        </button>
                        <h2 className="mr-48 text-3xl">Photos of {place.title}</h2>
                    </div>
                    {place?.photos?.length > 0 && place.photos.map(photo => (
                    <div>
                        <img src ={'http://localhost:4000/uploads/'+photo} alt='' />
                    </div>
                    ))}
                </div>
            </div>
        )
    }

    return(
        <div className="px-8 pt-8 mt-4 -mx-8 bg-gray-100">
            <h1 className="text-3xl">{place.title}</h1>
            <a className="flex gap-1 my-3 font-semibold underline" target='_blank' href={'https://maps.google.com/?q='+place.address}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                {place.address}
            </a>    
            <div className="relative">
                <div className="grid gap-2 grid-cols-[2fr_1fr] rounded-3xl overflow-hidden">
                    <div>
                    {place.photos?.[0] && (
                        <div>
                        <img onClick={() => setShowAllPhotos(true)}  className="object-cover cursor-pointer aspect-square" src={'http://localhost:4000/uploads/'+place.photos[0]} alt=""/>
                        </div>
                    )}
                    </div>
                    <div className="grid">
                    {place.photos?.[1] && (
                        <img onClick={() => setShowAllPhotos(true)}  className="object-cover cursor-pointer aspect-square" src={'http://localhost:4000/uploads/'+place.photos[1]} alt=""/>
                    )}
                    <div className="overflow-hidden">
                        {place.photos?.[2] && (
                        <img onClick={() => setShowAllPhotos(true)}  className="relative object-cover cursor-pointer aspect-square top-2" src={'http://localhost:4000/uploads/'+place.photos[2]} alt=""/>
                        )}
                    </div>
                    </div>
                </div>
                <button onClick={() => setShowAllPhotos(true)} className="absolute flex gap-1 px-4 py-2 bg-white shadow-md bottom-2 right-2 rounded-2xl shadow-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                    </svg>
                    Show more photos
                </button>
            </div>
            
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