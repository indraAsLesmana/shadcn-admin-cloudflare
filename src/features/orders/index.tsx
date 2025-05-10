import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
// Placeholder: you should implement these for orders
// import OrdersProvider from './context/orders-context'
// import { OrdersDialogs } from './components/orders-dialogs'
// import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
// import { columns } from './components/orders-columns'
// import { orders } from './data/orders'
// import { DataTable } from './components/data-table'

// Temporary mock implementations for demonstration
const OrdersProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
const OrdersDialogs = () => null
const OrdersPrimaryButtons = () => null
const orders = [
    { orderId: 'ORD-001', address: '123 Main St', status: 'Pending' },
    { orderId: 'ORD-002', address: '456 Elm St', status: 'Shipped' },
]
const columns = [
    {
        accessorKey: 'orderId',
        header: 'Order Id',
    },
    {
        accessorKey: 'address',
        header: 'Address',
    },
    {
        accessorKey: 'status',
        header: 'Status',
    },
]
const DataTable = ({ data, columns }: { data: any[]; columns: any[] }) => (
    <table className="min-w-full divide-y divide-gray-200">
        <thead>
            <tr>
                {columns.map((col) => (
                    <th key={col.accessorKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
                <tr key={idx}>
                    {columns.map((col) => (
                        <td key={col.accessorKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {row[col.accessorKey]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

export default function Orders() {
    return (
        <OrdersProvider>
            <Header fixed>
                <Search />
                <div className='ml-auto flex items-center space-x-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>
            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Order</h2>
                        <p className='text-muted-foreground'>
                            Here&apos;s a list of your orders for this month!
                        </p>
                    </div>
                    <OrdersPrimaryButtons />
                </div>
                <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <DataTable data={orders} columns={columns} />
                </div>
            </Main>
            <OrdersDialogs />
        </OrdersProvider>
    )
}
