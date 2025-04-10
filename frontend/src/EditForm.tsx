import { Banner, Button, ButtonGroup, Modal, Stack } from '@nordhealth/react'
import React, { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { updateDocWithId } from './data';
import { toast } from 'sonner';

const EditForm = ({ open, setOpen, row, collection, FormComponent }:
    {
        open: boolean, setOpen: (value: boolean) => void, row: Record<string, any> | null, collection: string,
        FormComponent: React.ComponentType<{ formData: any, setFormData: any, row: any }>

    }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});


    const [error, setError] = useState<{ message: string; variant: "danger" | "warning" | "success" } | null>(null);



    useEffect(() => {

        setFormData(row?.original)

    }, [row]);
    // const [toast, setToast] = useState<toastOptions | null>(null);


    const updateMutation = useMutation({
        mutationKey: ['updateMutation'],
        mutationFn: () => {
            delete formData["Bales Given/Sold"]
            const { id, timestamp, ...rem } = formData            

            return updateDocWithId(id, rem, collection)
        },
        onSuccess: async () => {
            toast.success("Document updated successfully")

            setOpen(false)
            // window.location.reload()

        },
        onError: (err) => {
            console.log(err);

            toast.error("Document updated failed")

        }
    })



    return (
        <Modal open={open} onClose={() => setOpen(false)}>

            <h2 slot="header" id="title">Edit {collection}</h2>
            <form method="dialog" id="myForm">
                <Stack>
                    {/* Show error/success message */}
                    {error && !updateMutation.isPending && <Banner variant={error.variant}>{error.message}</Banner>}
                    {FormComponent && <FormComponent row={row?.original} formData={formData} setFormData={setFormData} />}


                    {/* <CapacityForm row={row?.original} formData={formData} setFormData={setFormData}/> */}



                </Stack>
            </form>
            <ButtonGroup slot="footer" variant="spaced">
                <Button onClick={() => setOpen(false)} expand value="cancel">Cancel</Button>
                <Button loading={updateMutation.isPending} expand type="submit" value="add" variant="primary" onClick={() => {
                    updateMutation.mutate()
                }}>Save</Button>
            </ButtonGroup>
        </Modal>
    )
}

export default EditForm
