import { Button, ButtonGroup, Modal, Select } from '@nordhealth/react'
import  { useState } from 'react'
import { UsersRowData } from './routes/_authenticated/app/users'
import { QueryClient, useMutation } from '@tanstack/react-query';
import {  updateUser } from './data';
import { toast } from 'sonner';

const EditModal = ({ open, setOpen, user }: { open: boolean, setOpen: (value: boolean) => void, user: UsersRowData }) => {
    const [status, setStatus] = useState<string>(user.status);
    // const [toast, setToast] = useState<toastOptions | null>(null);


    const updateMutation = useMutation({
        mutationKey: ['updateMutation',  status],
        mutationFn: () => {
            return updateUser(user.docId, { status })
        },
        onSuccess: async () => {
            toast.success("User updated successfully")

            
            setOpen(false)
            // window.location.reload()

        },
        onError: (err) => {
            console.log(err);
            toast.error("User updated failed")



        }
    })


    return (
        <Modal open={open} onClose={() => setOpen(false)}>

            <h2 slot="header" id="title">Edit '{user.name ?? user.email}' user</h2>
            <form method="dialog" id="myForm">
                    <Select expand label='Status' value={status} name='status' onChange={(e) => {
                        let select = e.target as HTMLInputElement
                        let value = select.value
                        setStatus(value)
                    }}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </Select>
               
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

export default EditModal
