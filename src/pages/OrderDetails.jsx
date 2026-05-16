import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchApi } from '../api/client';
import toast from 'react-hot-toast';
import { ArrowLeft, Download, Package, CalendarDays, UserRound } from 'lucide-react';

const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl != null && String(envUrl).trim() !== '') {
    return String(envUrl).replace(/\/$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:5000';
  }
  return '';
};

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await fetchApi(`/api/orders/${orderId}`);
        setOrder(data);
      } catch (err) {
        toast.error(err.message || 'Unable to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const computedSubtotal = useMemo(() => {
    if (!order?.items) return 0;
    return order.items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }, [order]);

  const downloadInvoice = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const baseUrl = getApiBaseUrl();
      const url = `${baseUrl}/api/orders/${orderId}/invoice`;
      const response = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error('Invoice download failed');
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `invoice-ORD-${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
      toast.success('Invoice downloaded');
    } catch (err) {
      toast.error(err.message || 'Unable to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#8b3dff]" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <button
          onClick={() => navigate('/orders')}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#8b3dff]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <p className="text-gray-600">Order not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => navigate('/orders')}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#207a6e] cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>

        <button
          onClick={downloadInvoice}
          disabled={downloading}
          className="inline-flex items-center gap-2 rounded-sm bg-[#207a6e] px-2 py-1 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Download className="h-4 w-4" />
          {downloading ? 'Downloading...' : 'Download Invoice'}
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 px-5 py-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Order Number</p>
            <p className="text-lg font-semibold text-gray-900">ORD-{order.id}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Status</p>
            <p className="text-sm font-semibold uppercase text-[#207a6e]">{order.status}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total Amount</p>
            <p className="text-lg font-semibold text-gray-900">Rs.{Number(order.total_amount).toFixed(2)}</p>
          </div>
        </div>

        <div className="grid gap-3 border-b border-gray-200 px-5 py-4 md:grid-cols-2">
          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
            <CalendarDays className="h-4 w-4 text-gray-500" />
            {new Date(order.created_at).toLocaleString('en-IN')}
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-700">
            <UserRound className="h-4 w-4 text-gray-500" />
            {order.customer_name} ({order.customer_email})
          </div>
        </div>

        <div className="space-y-3 px-5 py-5">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4 rounded-lg border border-gray-200 p-3">
              <div className="h-20 w-20 overflow-hidden rounded-md">
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="h-full w-full object-contain p-2"
                />
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.product_name}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-600">Price: Rs.{item.price}</p>
                <p className="mt-1 text-sm font-semibold text-gray-900">
                  Item Total: Rs.{(Number(item.price) * Number(item.quantity)).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 bg-gray-50 px-5 py-4 text-right">
          <p className="text-sm text-gray-600">Subtotal: Rs.{computedSubtotal.toFixed(2)}</p>
          <p className="text-lg font-bold text-gray-900">Grand Total: Rs.{Number(order.total_amount).toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;
