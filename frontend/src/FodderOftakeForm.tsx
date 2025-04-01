import React from 'react'
import { Input } from '@nordhealth/react'
import { EditForm } from './BoreholeForm';


const FodderOftakeForm = ({ formData, setFormData }: EditForm) => {

    const handleChange = (e: Event) => {
        const input = e.target as HTMLInputElement

        setFormData({ ...formData, [input.name]: input.value });
    };
    return (
        <>
            <Input label="Date" name="date" value={formData?.date} onInput={handleChange} expand />
            <Input label="Farmer Name" name="farmerName" value={formData?.farmerName} onInput={handleChange} expand />
            <Input label='Region' name='region' value={formData?.region} onInput={handleChange} expand />
            <Input label='Bale Price' name='balePrice' value={formData?.balePrice} onInput={handleChange} expand />
            <Input label="Location" type="text" name="location" value={formData?.location} onInput={handleChange} expand />
        </>
    )
}

export default FodderOftakeForm
