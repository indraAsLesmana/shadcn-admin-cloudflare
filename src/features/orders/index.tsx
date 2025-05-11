import { Header } from '@/components/layout/header';
import { Main } from '@/components/layout/main';
import { ProfileDropdown } from '@/components/profile-dropdown';
import { Search } from '@/components/search';
import { ThemeSwitch } from '@/components/theme-switch';
import { API_ENDPOINTS } from '@/contants/api';
import React from 'react';
// Placeholder: you should implement these for orders
// import OrdersProvider from './context/orders-context'
// import { OrdersDialogs } from './components/orders-dialogs'
// import { OrdersPrimaryButtons } from './components/orders-primary-buttons'
// import { columns } from './components/orders-columns'
// import { orders } from './data/orders'
// import { DataTable } from './components/data-table'

// Temporary mock implementations for demonstration
const OrdersProvider = ({ children }: { children: React.ReactNode }) => <>{children}</>
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

const columns = ({ onEdit, onDelete }: { onEdit: (row: any) => void, onDelete: (row: any) => void }) => [
    {
        id: 'actions',
        header: '',
        cell: ({ row }: { row: any }) => <OrderRowActions row={row.original} onEdit={onEdit} onDelete={onDelete} />, // Custom actions button
    },
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
];

// Option button component for each row
function OrderRowActions({ row, onEdit, onDelete }: { row: any, onEdit: (row: any) => void, onDelete: (row: any) => void }) {
    const [open, setOpen] = React.useState(false);
    const menuRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (!open) return;
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                className="px-2 py-1 text-gray-500 hover:text-gray-700"
                onClick={() => setOpen((v) => !v)}
                aria-label="Options"
            >
                ⋮
            </button>
            {open && (
                <div ref={menuRef} className="absolute left-0 z-10 mt-2 w-28 rounded-md bg-white shadow-lg border flex flex-col gap-1 py-1">
                    <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => {
                            setOpen(false);
                            onEdit(row);
                        }}
                    >Edit</button>
                    <button
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                            setOpen(false);
                            onDelete(row);
                        }}
                    >Delete</button>
                </div>
            )}
        </div>
    );
}
const DataTable = ({ data, columns }: { data: any[]; columns: any[] }) => (
    <table className="min-w-full divide-y divide-gray-200">
        <thead>
            <tr>
                {columns.map((col) => (
                    <th key={col.accessorKey || col.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {col.header}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
                <tr key={idx}>
                    {columns.map((col) => (
                        <td key={col.accessorKey || col.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {col.cell ? col.cell({ row }) : row[col.accessorKey]}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
)

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const orderStatusOptions = [
    { label: 'Need to Verify', value: 'need_to_verify' },
    { label: 'Paid', value: 'paid' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' },
];
const paymentMethodOptions = [
    { label: 'Bank Transfer', value: 'bank_transfer' },
    { label: 'Credit Card', value: 'credit_card' },
    { label: 'Cash', value: 'cash' },
];

const orderFormSchema = z.object({
    recipientName: z.string().min(1, 'Recipient name is required'),
    phone: z.string().min(1, 'Phone is required'),
    completeAddress: z.string().min(1, 'Address is required'),
    status: z.string().min(1, 'Status is required'),
    paymentMethod: z.string().min(1, 'Payment method is required'),
});

type OrderFormValues = z.infer<typeof orderFormSchema>;

function OrdersActionDialog({ open, onOpenChange, currentRow }: any) {
    const isEdit = Boolean(currentRow);
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(orderFormSchema),
        defaultValues: {
            recipientName: currentRow?.recipientName || '',
            phone: currentRow?.phone || '',
            completeAddress: currentRow?.completeAddress || '',
            status: currentRow?.status || '',
            paymentMethod: currentRow?.paymentMethod || '',
        },
    });

    React.useEffect(() => {
        form.reset({
            recipientName: currentRow?.recipientName || '',
            phone: currentRow?.phone || '',
            completeAddress: currentRow?.completeAddress || '',
            status: currentRow?.status || '',
            paymentMethod: currentRow?.paymentMethod || '',
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentRow, open]);

    function onSubmit(values: OrderFormValues) {
        // TODO: Implement save logic (API call)
        // You can call an API here and close dialog on success
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={(state) => {
            form.reset();
            onOpenChange(state);
        }}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader className="text-left">
                    <DialogTitle>{isEdit ? 'Edit Order' : 'Add New Order'}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? 'Update the order here. ' : 'Create new order here. '}
                        Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4">
                    <Form {...form}>
                        <form
                            id="order-form"
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4 p-0.5"
                        >
                            <FormField
                                control={form.control}
                                name="recipientName"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Recipient Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., John Doe" className="col-span-4" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 08123456789" className="col-span-4" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="completeAddress"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Jl. Example No. 123" className="col-span-4" autoComplete="off" {...field} />
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Status</FormLabel>
                                        <FormControl>
                                            <select
                                                className="col-span-4 border rounded-md px-2 py-1 w-full"
                                                {...field}
                                            >
                                                <option value="">Select status</option>
                                                {orderStatusOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1">
                                        <FormLabel className="col-span-2 text-right">Payment Method</FormLabel>
                                        <FormControl>
                                            <select
                                                className="col-span-4 border rounded-md px-2 py-1 w-full"
                                                {...field}
                                            >
                                                <option value="">Select payment method</option>
                                                {paymentMethodOptions.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                        <FormMessage className="col-span-4 col-start-3" />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </div>
                <DialogFooter>
                    <Button type="submit" form="order-form">
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
function OrdersDeleteDialog({ open, onOpenChange, currentRow }: any) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-bold mb-2">Delete Order?</h2>
                <pre>{JSON.stringify(currentRow, null, 2)}</pre>
                <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded" onClick={() => onOpenChange(false)}>Cancel</button>
                <button className="mt-2 ml-2 px-4 py-2 bg-gray-300 rounded" onClick={() => onOpenChange(false)}>Confirm</button>
            </div>
        </div>
    );
}

export default function Orders() {
    const [orders, setOrders] = React.useState<Order[]>([]);
    const [openDialog, setOpenDialog] = React.useState<'edit' | 'delete' | null>(null);
    const [currentRow, setCurrentRow] = React.useState<any>(null);

    const [meta, setMeta] = React.useState<OrdersResponse['meta']>({ page: 1, pageSize: 20, total: 0, totalPages: 1 });
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Enhance orders with action handlers for row menu
    const enhancedOrders = orders.map((order) => ({
        ...order,
        onEdit: (row: any) => {
            setCurrentRow(row);
            setOpenDialog('edit');
        },
        onDelete: (row: any) => {
            setCurrentRow(row);
            setOpenDialog('delete');
        },
    }));

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
                        <DataTable
                            data={orders}
                            columns={columns({
                                onEdit: (row) => {
                                    setCurrentRow(row);
                                    setOpenDialog('edit');
                                },
                                onDelete: (row) => {
                                    setCurrentRow(row);
                                    setOpenDialog('delete');
                                },
                            })}
                        />
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
            {/* Order dialogs for edit/delete */}
            <OrdersActionDialog
                open={openDialog === 'edit'}
                onOpenChange={(open: boolean) => {
                    setOpenDialog(open ? 'edit' : null);
                    if (!open) setTimeout(() => setCurrentRow(null), 500);
                }}
                currentRow={currentRow}
            />
            <OrdersDeleteDialog
                open={openDialog === 'delete'}
                onOpenChange={(open: boolean) => {
                    setOpenDialog(open ? 'delete' : null);
                    if (!open) setTimeout(() => setCurrentRow(null), 500);
                }}
                currentRow={currentRow}
            />
        </OrdersProvider>
    );
}

