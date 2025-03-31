import { Button, ButtonGroup, Input, Modal, Select, Stack, Toast } from '@nordhealth/react'
import { useState } from 'react'
import { UsersRowData } from './routes/_authenticated/app/users'
import { QueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { CdeleteUser } from './data';

const DeleteModal = ({ open, setOpen, user }: { open: boolean, setOpen: (value: boolean) => void, user: UsersRowData }) => {
    const [status, setStatus] = useState<string>(user.status);
    const queryClient = new QueryClient()
    // const [toast, setToast] = useState<toastOptions | null>(null);


    const updateMutation = useMutation({
        mutationKey: ['updateMutation', status],
        mutationFn: (id:string) => {
            return CdeleteUser(id)
        },
        onSuccess: async () => {
            toast.success("User deleted successfully")

            await queryClient.invalidateQueries({
                queryKey: ['usersQuery'],
                refetchType: 'all',
            });
            setOpen(false)

        },
        onError: (err) => {
            console.log(err);
            toast.error("User deletion failed")



        }
    })


    return (
        <Modal open={open} onClose={() => setOpen(false)}>

            <h2 slot="header" id="title">Delete {user.name ?? user.email} user?</h2>

            <p className='n-reset'>All user information will be deleted.</p>
            <ButtonGroup slot="footer" variant="spaced">
                <Button onClick={() => setOpen(false)} expand value="cancel">Cancel</Button>
                <Button loading={updateMutation.isPending} expand type="submit" value="add" variant="danger" onClick={() => {
                    updateMutation.mutate(user.docId)
                }}>Delete</Button>
            </ButtonGroup>
        </Modal>
    )
}
export default DeleteModal
