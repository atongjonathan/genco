import { Input } from '@nordhealth/react'
import { EditForm } from './BoreholeForm';

const CapacityForm = ({ formData, setFormData }:EditForm) => {


  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
     
    setFormData({ ...formData, [input.name]: input.value });
  }
  
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
