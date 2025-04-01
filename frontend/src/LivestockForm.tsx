import { Input } from '@nordhealth/react'
import { EditForm } from './BoreholeForm';

const LivestockForm = ({ formData, setFormData }:EditForm) => {



  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement
     
    setFormData({ ...formData, [input.name]: input.value });
  };
  return (
    <>
      <Input label="Date Submitted" type="text" name="dateSubmitted" value={formData?.dateSubmitted} onInput={handleChange} expand />
      <Input label="Name" name="name" value={formData?.name} onInput={handleChange} expand />
      <Input label='Gender' name='Gender' value={formData?.gender} onInput={handleChange} expand />
      <Input label='ID No' name='idNo' value={formData?.idNo} onInput={handleChange} expand />
      <Input label='Phone No' name='phoneNo' value={formData?.phoneNo} onInput={handleChange} expand />
    </>
  )
}

export default LivestockForm
