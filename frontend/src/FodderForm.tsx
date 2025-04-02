import { Input } from '@nordhealth/react'
import { EditForm } from './BoreholeForm';

const FodderForm = ({ formData, setFormData }:EditForm) => {



  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
     
    setFormData({ ...formData, [input.name]: input.value });
  };
  return (
    <>
      <Input label="Date" name="date" value={formData?.date} onInput={handleChange} expand />
      <Input label="Location" type="text" name="location" value={formData?.location} onInput={handleChange} expand />
      <Input label="Model" name="model" value={formData?.model} onInput={handleChange} expand />
      <Input label='region' name='region' value={formData?.region} onInput={handleChange} expand />
      <Input label='totalBales' name='totalBales' value={formData?.totalBales} onInput={handleChange} expand />
      <Input label='landSize' name='landSize' value={formData?.landSize} onInput={handleChange} expand />
    </>
  )
}

export default FodderForm
