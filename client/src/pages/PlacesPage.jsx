import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Perks from "../Perks";
import PhotosUploader from "../PhotosUploader";
import axios from "axios";

export default function PlacesPage(){
    const {action} = useParams();
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [perks, setPerks] = useState('');
    const [extraInfo, setExtraInfo] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [maxGuests, setMaxGuests] = useState(1);
    const [addedPhotos, setAddedPhotos] = useState([]);
    const [redirectToPlacesList, setRedirectToPlacesList] = useState(false);

    function inputHeader(text) {
        return (
            <h2 className="mt-4 text-2xl">{text}</h2>
        )
    }

    function inputDescription(text) {
        return (
            <p className="text-sm text-gray-500">{text}</p>
        )
    }

    function preInput(header, description){
        return (
            <div>
                {inputHeader(header)}
                {inputDescription(description)}
            </div>
        )
    }

    async function addNewPlace(ev){
        ev.preventDefault();
        await axios.post('/places', {
            title, 
            address, 
            description, 
            addedPhotos,
            perks, 
            extraInfo, 
            checkIn, 
            checkOut, 
            maxGuests
        });
        setRedirectToPlacesList(true);
    }

    if(redirectToPlacesList && action !== 'new') {
        return <Navigate to='/account/places' />;
    }

    return (
        <div>
            {action != 'new' && (
                <div className="text-center">
                    <div className="">
                        <Link className="inline-flex gap-1 px-6 py-2 mt-6 text-white rounded-full bg-primary" to={'/account/places/new'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>

                            Add new place
                        </Link>
                    </div>
                    My place
                </div>
            )}
            {action === 'new' && (
                <div>
                    <form onSubmit={addNewPlace}>
                        {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                        <input value={title} 
                                onChange={ev => setTitle(ev.target.value)} 
                                type="text" 
                                placeholder="title, for example: My lovely apartment" />
                        {preInput('Address', 'Address to this place')}
                        <input value={address} 
                                onChange={ev => setAddress(ev.target.value)} 
                                type="text" 
                                placeholder="address" />
                        {preInput('Photos', 'More = better')}
                        <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
                        {preInput('Description','Description of the place')}
                        <textarea value={description} 
                                onChange={ev => setDescription(ev.target.value)}/>
                        {preInput('Perks','Select all the perks of your place')}
                        <div className="grid grid-cols-2 gap-2 mt-2 md:grid-cols-3 lg:grid-cols-6">
                            <Perks selected={perks} onChange={setPerks}/>
                        </div>
                        {preInput('Extra','House rules, etc')}
                        <textarea value={extraInfo} 
                                onChange={ev => setExtraInfo(ev.target.value)}/>
                        {preInput('Check in & out times','Add check in and out times, remember to have some time for cleaning the rooms between guests')}
                        <div className="grid gap-2 sm:grid-cols-3">
                            <div>
                                <h3 className="mt-2 -mb-1 ">Check in time</h3>
                                <input value={checkIn} 
                                        onChange={ev => setCheckIn(ev.target.value)} 
                                        type="text" 
                                        placeholder="11:11"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1 ">Check out time</h3>
                                <input type="text" 
                                        value={checkOut} 
                                        onChange={ev => setCheckOut(ev.target.value)} 
                                        placeholder="12:34"/>
                            </div>
                            <div>
                                <h3 className="mt-2 -mb-1 ">Max number of guests</h3>
                                <input type="number"  
                                        value={maxGuests} 
                                        onChange={ev => setMaxGuests(ev.target.value)}/>
                            </div>
                        </div>
                        <button className="my-4 primary" type="submit">Save</button>
                    </form>
                </div>
            )}
        </div>
    )
}