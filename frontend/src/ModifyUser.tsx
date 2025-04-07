import { Button, ButtonGroup, Icon } from '@nordhealth/react'
import React, { useCallback, useState } from 'react'
import { UsersRowData } from './routes/_authenticated/app/_admin/users'
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';

const ModifyUser = ({ row }: { row: UsersRowData }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [deleteOpen, setDeleteOpen] = useState<boolean>(false);



    return (

        <ButtonGroup variant='spaced'>
            <EditModal open={open} setOpen={useCallback(setOpen, [open])} user={row} />
            <Button onClick={() => {
                setOpen((prev) => !prev)
            }}>
                <Icon name='interface-edit' label='Edit' />
            </Button>
            <DeleteModal open={deleteOpen} setOpen={useCallback(setDeleteOpen, [deleteOpen])} row={row} collection='users'/>
            <Button variant='danger' onClick={() => {
                setDeleteOpen((prev) => !prev)
            }}>
                <Icon name='interface-delete' label='Delete' />
            </Button>
        </ButtonGroup>
    )
}

export default ModifyUser
