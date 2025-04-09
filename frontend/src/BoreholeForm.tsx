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
      <Input label="BoreholeLocation" name="BoreholeLocation" value={formData?.["BoreholeLocation"]} onInput={handleChange} expand />
      <Input label='PeopleUsingBorehole' name='PeopleUsingBorehole' value={formData?.["PeopleUsingBorehole"]} onInput={handleChange} expand />
      <Input label='Region' name='Region' value={formData?.Region} onInput={handleChange} expand />
      <Input label='WaterUsed' name='WaterUsed' value={formData?.["WaterUsed"]} onInput={handleChange} expand />
    </>
  )
}

export default BoreholeForm
