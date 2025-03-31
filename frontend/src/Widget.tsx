import { Stack } from '@nordhealth/react'

const Widget = ({ title, value }: { title: string, value: number }) => {
    return (
        <Stack gap='s' className='n-padding-m n-border n-border-radius cursor-pointer n-color-surface hover:bg-[#fafbfb]'>
            <h2 className='n-font-size-xs n-truncate-1 uppercase'>{title}</h2>
            <h1 className='n-font-size-l n-font-weight-heading n-color-text'>{value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h1>
        </Stack>
    )
}

export default Widget
