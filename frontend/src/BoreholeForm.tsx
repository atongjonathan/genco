import { Input } from '@nordhealth/react'


export type EditForm = { formData: any, setFormData: any }
const BoreholeForm = ({ formData, setFormData }: EditForm) => {



  const handleChange = (e: Event) => {
    const input = e.target as HTMLInputElement

    setFormData({ ...formData, [input.name]: input.value });
  };
  return (
    <>
      <Input label="Date" type="text" name="Date" value={formData?.Date} onInput={handleChange} expand />
      <Input label="Borehole Location" name="Borehole Location" value={formData?.["Borehole Location"]} onInput={handleChange} expand />
      <Input label='People Using Borehole' name='People Using Borehole' value={formData?.["People Using Borehole"]} onInput={handleChange} expand />
      <Input label='Region' name='Region' value={formData?.Region} onInput={handleChange} expand />
      <Input label='Water Used' name='Water Used' value={formData?.["Water Used"]} onInput={handleChange} expand />
    </>
  )
}

export default BoreholeForm
