import { useEffect, useState } from "react";
import { fetchApi } from "../api/client";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const data = await fetchApi("/api/orders");
                setOrders(data);
            } catch (err) {
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
    }, []);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'shipped': return <Truck className="h-5 w-5 text-blue-500" />;
            case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
            default: return <Package className="h-5 w-5 text-gray-500" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8b3dff]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-2 md:px-3 py-1 flex flex-col items-center">
            <h1 className="md:text-2xl text-lg font-semibold mb-2 text-center">My Orders</h1>

            {orders.length === 0 ? (
                <div className="w-full mx-auto text-center py-20 bg-gray-50 rounded-2xl">
                    <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">No orders yet.</p>
                </div>
            ) : (
                <div className="w-full mx-auto space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            className="bg-white border border-gray-300 overflow-hidden rounded-lg"

                        >
                            <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-gray-300">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Placed</p>
                                        <p className="text-sm font-medium truncate">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
                                        <p className="text-md font-bold">Rs.{order.total_amount}</p>
                                    </div>
                                </div>
                                <div className="text-right ml-2 shrink-0">
                                    <p className="md:text-sm text-xs text-gray-500 uppercase font-bold tracking-wider">Order #</p>
                                    <p className="md:text-md text-sm font-medium">ORD-{order.id}</p>
                                </div>
                            </div>

                            <div className="px-2 py-3 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                    {getStatusIcon(order.status)}
                                    <span className="font-semibold uppercase text-sm tracking-wide">{order.status || 'Processing'}</span>
                                </div>

                                <div className="space-y-3">
                                    {order.items?.map((item, idx) => (
                                        <div key={idx} className="flex gap-1 items-center border border-gray-300 rounded-lg">
                                            <div className="h-20 w-25 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image_url} alt={item.product_name} className="h-full w-full object-contain p-2" />
                                            </div>
                                            <div className="flex-1 text-left">
                                                <h4 className="font-medium text-md md:text-lg text-gray-900">{item.product_name}</h4>
                                                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                <p className="text-md font-bold">Rs.{item.price}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/orders/${order.id}`);
                                        }}
                                        className="rounded-sm border border-[#207a6e] px-2 py-1 text-sm font-bold cursor-pointer text-[#207a6e]"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;
