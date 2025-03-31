import { fetchUsers } from '@/data'
import ModifyUser from '@/ModifyUser'
import { DataTable } from '@/TanstackTable'
import { Header, ProgressBar } from '@nordhealth/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export type UsersRowData = {
  "name": "Martin KM2",
  "createdAt": {
    "seconds": number,
    "nanoseconds": number
  },
  "role": string,
  "status": string,
  "email": string,
  "uid": string,
  "docId": string
}
export const Route = createFileRoute('/_authenticated/app/users')({
  component: RouteComponent,
})


function RouteComponent() {
  const usersQuery = useQuery({
    queryKey: ["usersQuery"],
    queryFn: () => {
      return fetchUsers()
    }
  })
  document.title = "Users"


  const columns: ColumnDef<UsersRowData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },{
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ModifyUser row={row.original} />
    }
  ]

  const [total, settotal] = useState(0);
  
  return <>

    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Users</h1></Header>
    {
      usersQuery.isPending && <ProgressBar/>
    }   
    {
      usersQuery.data && <DataTable onTotalChange={settotal} columns={columns} data={usersQuery.data} />
    }

  </>
}
