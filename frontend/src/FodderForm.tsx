import { Input } from '@nordhealth/react'
import React from 'react'

const FodderForm = ({ row, formData, setFormData }) => {


  // ✅ Handle input changes
  const handleChange = (e) => {


    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
      <Input label="Location" type="text" name="location" value={formData?.location} onInput={handleChange} expand />
      <Input label="Model" name="model" value={formData?.model} onInput={handleChange} expand />
      <Input label='region' name='region' value={formData?.region} onInput={handleChange} expand />
      <Input label='totalBales' name='totalBales' value={formData?.totalBales} onInput={handleChange} expand />
      <Input label='landSize' name='landSize' value={formData?.landSize} onInput={handleChange} expand />
    </>
  )
}

export default FodderForm
