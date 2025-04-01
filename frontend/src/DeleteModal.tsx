import { Button, ButtonGroup, Input, Modal, Select, Stack, Toast } from '@nordhealth/react'
import { useEffect, useState } from 'react'
import { UsersRowData } from './routes/_authenticated/app/users'
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {  deleteDocument } from './data';

const DeleteModal = ({ open, setOpen, row, collection }: { open: boolean, setOpen: (value: boolean) => void, row: Record<string, any> | null, collection:string }) => {
    const queryClient = new QueryClient()
   
    // const [toast, setToast] = useState<toastOptions | null>(null);


    const updateMutation = useMutation({
        mutationKey: ['updateMutation'],
        mutationFn: (id:string) => {
            
            return deleteDocument(collection, id)
        },
        onSuccess: async () => {
            toast.success("Document deleted successfully")

            await queryClient.invalidateQueries({
                queryKey: ['usersQuery'],
                refetchType: 'all',
            });
            setOpen(false)

        },
        onError: (err) => {
            console.log(err);
            toast.error("Document deletion failed")



        }
    })


    return (
        <Modal open={open} onClose={() => setOpen(false)}>

            <h2 slot="header" id="title">Delete {row?.docId } document?</h2>

            <p className='n-reset'>All document information will be deleted.</p>
            <ButtonGroup slot="footer" variant="spaced">
                <Button onClick={() => setOpen(false)} expand value="cancel">Cancel</Button>
                <Button loading={updateMutation.isPending} expand type="submit" value="add" variant="danger" onClick={() => {
                    updateMutation.mutate(row?.docId ?? row?.id)
                }}>Delete</Button>
            </ButtonGroup>
        </Modal>
    )
}
export default DeleteModal
