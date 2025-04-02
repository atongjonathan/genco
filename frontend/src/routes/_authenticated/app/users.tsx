import { fetchUsers } from '@/data'
import ModifyUser from '@/ModifyUser'
import { DataTable } from '@/TanstackTable'
import { Header, ProgressBar } from '@nordhealth/react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { ColumnDef, ColumnMeta, RowData } from '@tanstack/react-table'
import { DocumentData } from 'firebase/firestore'

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


  const columns: ColumnDef<DocumentData>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
      meta: {
        className: "n-table-ellipsis"

      } as ColumnMeta<DocumentData, RowData>
    },
    {
      accessorKey: "role",
      header: "Role",
    }, {
      accessorKey: "status",
      header: "Status",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <ModifyUser row={row.original as UsersRowData} />
    }
  ]


  return <>

    <Header slot="header"><h1 className='n-typescale-m font-semibold'>Users</h1></Header>
    {
      usersQuery.isPending && <ProgressBar />
    }
    {
      usersQuery.data && <DataTable columns={columns} data={usersQuery.data} />
    }

  </>
}
