import { Input } from '@nordhealth/react'
import React from 'react'

const CapacityForm = ({ row, formData, setFormData }) => {


  // ✅ Handle input changes
  const handleChange = (e) => {


    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Input label="Name" type="text" name="Name" value={formData?.Name} onInput={handleChange} expand />
      <Input label="Date" name="date" value={formData?.date} onInput={handleChange} expand />
      <Input label='Gender' name='Gender' value={formData?.Gender} onInput={handleChange} expand />
      <Input label='Location' name='Location' value={formData?.Location} onInput={handleChange} expand />
      <Input label='Modules' name='Modules' value={formData?.Modules} onInput={handleChange} expand />
    </>
  )
}

export default CapacityForm
