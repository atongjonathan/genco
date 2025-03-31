import { Input } from '@nordhealth/react'
import React from 'react'

const HayForm = ({ row, formData, setFormData }) => {


    // ✅ Handle input changes
    const handleChange = (e) => {

        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    return (
        <>
            <Input label="Date" type="text" name="Date" value={formData?.Date} onInput={handleChange} expand />
            <Input label="Bales Size" name="Bales Size" value={formData?.["Bales Size"]} onInput={handleChange} expand />
            <Input label='Facility' name='Hay Storage Facility' value={formData?.["Hay Storage Facility"]} onInput={handleChange} expand />
            <Input label='Region' name='Region' value={formData?.Region} onInput={handleChange} expand />
            <Input label='Revenue From Sales' name='Revenue From Sales' value={formData?.["Revenue From Sales"]} onInput={handleChange} expand />
        </>
    )
}

export default HayForm
