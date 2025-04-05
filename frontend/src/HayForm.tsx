import { Input } from '@nordhealth/react'
import React from 'react'
import { EditForm } from './BoreholeForm';

const HayForm = ({ formData, setFormData }:EditForm) => {


    // ✅ Handle input changes
    
  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
     
    setFormData({ ...formData, [input.name]: input.value });
  };
    return (
        <>
            <Input label="Date" type="text" name="Date" value={formData?.Date} onInput={handleChange} expand />
            <Input label="Bales Size" name="BalesSize" value={formData?.["BalesSize"]} onInput={handleChange} expand />
            <Input label='Facility' name='HayStorageFacility' value={formData?.["HayStorageFacility"]} onInput={handleChange} expand />
            <Input label='Region' name='Region' value={formData?.Region} onInput={handleChange} expand />
            <Input label='Revenue From Sales' name='RevenueFromSaless' value={formData?.["RevenueFromSales"]} onInput={handleChange} expand />
        </>
    )
}

export default HayForm
