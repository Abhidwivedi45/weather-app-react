import React from 'react';
import {UilSearch, UilLocationPoint} from '@iconscout/react-unicons'
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function Inputs({setQuery, units, setUnits}) {
   const [city, setCity] = useState("")

   const handleSearchClick = () => {
    if(city!== '') setQuery({q: city})
   }

   const handleLocationClick = () => {
    if(navigator.geolocation){
      toast.info("Fetching Users Location.")
      navigator.geolocation.getCurrentPosition((positon) => {
        toast.success("Location Fetched!")
        let lat = positon.coords.latitude
        let lon = positon.coords.longitude

        setQuery({lat,lon});
      })
    }
   }

   const handleUnitChange = (e) => {
      const selectedUnit = e.currentTarget.name
      if(units !== selectedUnit) setUnits(selectedUnit);
   }

  return (
    <div className='flex flex-row justify-center my-6'>

      <div className='flex flex-row w-3/4 items-center justify-center space-x-4'>
            <input type="text"
               className='texr-xl font-light p-2 w-full shadow-xl focus:outline-none capitalize placeholder:lowercase'
               placeholder='search for city'
               value={city}
               onChange={(e)=> setCity(e.currentTarget.value)}
            />
           <UilSearch size={25} onClick={handleSearchClick} className="text-white cursor-pointer transition ease-out hover:scale-125"/>
           <UilLocationPoint onClick={handleLocationClick} size={25} className="text-white cursor-pointer transition ease-out hover:scale-125"/>
      </div>

      <div className='flex flex-row w-1/4 items-center justify-center'>
          <button name="metric" className='text-white font-light transition ease-out
            hover:scale-125' onClick={handleUnitChange}
            >{'\u00b0'}C</button>

            <p className='text-xl text-white mx-1'>|</p> 

          <button name="imperial" className='text-white font-light transition ease-out hover:scale-125'
          onClick={handleUnitChange}
          >{'\u00b0'}F</button>
      </div>
    </div>
  )
}
