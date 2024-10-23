import axios from "axios";
import { useState } from "react";

export default function PhotosUploader({addedPhotos, onChange}){
    const [photoLink, setPhotoLink] = useState('');

    async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data:filename} = await axios.post('/upload-by-link', {link: photoLink})
        onChange(prev => {
            return [...prev, filename];
        });
        setPhotoLink('');
    };

    function uploadPhoto(ev){
        const files = ev.target.files;
        const data = new FormData();
        for (let i = 0; i< files.length; i++) {
            data.append('photos', files[i]);
        }
        axios.post('/upload', data,{
            headers: { 'Content-Type': 'multipart/form-data'}
        }).then (response =>{
            const {data:filenames} = response;
            onChange(prev => {
                return [...prev, ...filenames];
            });
        })
    }
    return (
        <>
        <div className="flex gap-2">
            <input value={photoLink} 
                    onChange={ev => setPhotoLink(ev.target.value)} 
                    type="text" 
                    placeholder={'Add using a link ....jpg'}/>
            <button className="px-4 bg-gray-200 rounded-2xl"
                    onClick={addPhotoByLink}>
                Add&nbsp;photo
            </button>
        </div>
        <div className="grid grid-cols-3 gap-2 mt-2 md:grid-cols-4 lg:grid-cols-6">
            {addedPhotos.length > 0 && addedPhotos.map(link => (
                <div className="flex h-32" key={link}>
                    <img src={"http://localhost:4000/uploads/"+link} className="object-cover w-full rounded-2xl" />
                </div>
            ))}
            <label className="flex items-center justify-center h-32 gap-1 p-2 text-gray-600 bg-transparent border cursor-pointer rounded-2xl">
                <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                </svg>
                Upload
            </label>
        </div>
        </>
    );
}