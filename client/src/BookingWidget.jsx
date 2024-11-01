import { useContext, useEffect, useState } from "react"
import { differenceInCalendarDays } from "date-fns"
import axios from "axios";
import { UserContext } from "./UserContext";
import { Navigate } from "react-router-dom";

export default function BookingWidget({place}){
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [numberOfGuests, setNumberOfGuests] = useState(1);
    const [redirect, setRedirect] = useState('');
    const{user} = useContext(UserContext);

    useEffect(() =>{
        if(user){
            setName(user.name);
        }
    }, [user]);

    let numberOfNights = 0;

    if(checkIn && checkOut){ 
        numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
    }

    async function bookPlace(){
        const response = await axios.post('/bookings',{
            checkIn, checkOut, name, phone, numberOfNights,
            place: place._id,
            price: numberOfNights * place.price
        });
        const bookingId = response.data._id;
        setRedirect('/account/bookings/' + bookingId);
    }

    if(redirect){
        return <Navigate to={redirect} />;
    }

    return(
        <div className="p-4 bg-white shadow rounded-2xl">
            <div className="text-2xl text-center">
                Price: ${place.price} per night
            </div>
            <div className="mt-4 border rounded-2xl">
                <div className="flex">
                    <div className="px-4 py-3 ">
                        <label >Check-in:</label>
                        <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type="date" name="" id="" />    
                    </div>    
                    <div className="px-4 py-3 border-l">
                        <label >Check-out:</label>
                        <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type="date" name="" id="" />    
                    </div>  
                </div>
                <div className="px-4 py-3 border-t">
                        <label>Number of guests:</label>
                        <input value={numberOfGuests} onChange={ev => setNumberOfGuests(ev.target.value)} type="number" />    
                </div>  

                {numberOfNights > 0 && (
                    <div className="px-4 py-3 ">
                        <label>Your full-name:</label>
                        <input value={name} onChange={ev => setName(ev.target.value)} type="text" /> 
                        <label>Phone number:</label>
                        <input value={phone} onChange={ev => setPhone(ev.target.value)} type="tel" />    
                    </div>  
                )}
            </div>

            

            <button onClick={bookPlace} className="mt-4 primary">
                Book this place
                { numberOfNights > 0 && (
                    <span> ${numberOfNights * place.price}</span>
                )}    
            </button>
        </div>
    )
}