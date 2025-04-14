import React from 'react'
import { Input } from '@nordhealth/react'
import { EditForm } from './BoreholeForm';


const OfftakeForm = ({ formData, setFormData }: EditForm) => {

    const handleChange = (e: Event) => {
        const input = e.target as HTMLInputElement

        setFormData({ ...formData, [input.name]: input.value });
    };
    return (
        <>
            <Input label="Date" name="date" value={formData?.date} onInput={handleChange} expand />
            <Input label="Farmer Name" name="farmerName" value={formData?.farmerName} onInput={handleChange} expand />
            <Input label="Gender" name="gender" value={formData?.gender} onInput={handleChange} expand />
            <Input label="ID No" name="idNumber" value={formData?.idNumber} onInput={handleChange} expand />
            <Input label="Phone No" name="phoneNumber" value={formData?.phoneNumber} onInput={handleChange} expand />
            <Input label='Region' name='region' value={formData?.region} onInput={handleChange} expand />
            <Input label="Location" type="text" name="location" value={formData?.location} onInput={handleChange} expand />
        </>
    )
}

export default OfftakeForm
