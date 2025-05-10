import React from 'react';
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { API_ENDPOINTS } from '@/contants/api';
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
// API endpoint for orders
const ORDERS_API_URL = API_ENDPOINTS.ORDERS;

// Types for fetched data
interface Order {
    id: string;
    [key: string]: any;
}

interface OrdersResponse {
    orders: Order[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
}

const columns = [
    {
        accessorKey: 'id',
        header: 'Order Id',
    },
    {
        accessorKey: 'completeAddress',
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
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [meta, setMeta] = React.useState<OrdersResponse['meta']>({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Fetch orders from API
    const fetchOrders = React.useCallback(async (page: number, pageSize: number) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${ORDERS_API_URL}?page=${page}&pageSize=${pageSize}`, {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data: OrdersResponse = await res.json();
            setOrders(data.orders);
            setMeta(data.meta);
        } catch (err: any) {
            setError(err.message || 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        fetchOrders(meta.page, meta.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta.page, meta.pageSize]);

    // Pagination handlers
    const handlePrev = () => {
        if (meta.page > 1) setMeta((m) => ({ ...m, page: m.page - 1 }));
    };
    const handleNext = () => {
        if (meta.page < meta.totalPages) setMeta((m) => ({ ...m, page: m.page + 1 }));
    };

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
                    {loading ? (
                        <div className="p-4 text-center">Loading...</div>
                    ) : error ? (
                        <div className="p-4 text-red-500 text-center">{error}</div>
                    ) : (
                        <DataTable data={orders} columns={columns} />
                    )}
                </div>
                <div className="flex justify-between items-center mt-4 px-4">
                    <button onClick={handlePrev} disabled={meta.page === 1 || loading} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
                    <span>
                        Page {meta.page} of {meta.totalPages} (Total: {meta.total})
                    </span>
                    <button onClick={handleNext} disabled={meta.page === meta.totalPages || loading} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
            </Main>
            <OrdersDialogs />
        </OrdersProvider>
    );
}

