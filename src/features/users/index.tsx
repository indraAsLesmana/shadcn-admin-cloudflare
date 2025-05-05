import { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '@/contants/api'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { columns } from './components/users-columns'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersTable } from './components/users-table'
import UsersProvider from './context/users-context'
import { userListSchema, User } from './data/schema'

export default function Users() {
  const [userList, setUserList] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `${API_ENDPOINTS.USERS}?page=${page}&pageSize=${pageSize}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || 'Failed to fetch users')
          setUserList([])
          setTotalPages(1)
          return
        }
        if (!Array.isArray(data.users)) {
          setError('Malformed response: users is not an array')
          setUserList([])
          setTotalPages(1)
          return
        }
        const parsedUsers = userListSchema.parse(data.users)
        setUserList(parsedUsers)
        setTotalPages(data.meta?.totalPages ?? 1)
      } catch (e: any) {
        setError(e.message || 'Unknown error')
        setUserList([])
        setTotalPages(1)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page, pageSize])

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <UsersTable data={userList} columns={columns} />
        </div>
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
