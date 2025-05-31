import axios from "axios";
import React, { useEffect, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import DataTable from "~/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MoreHorizontal, ChevronDown, ChevronUp } from "lucide-react";

interface OrderItem {
  id: number;
  quantity: number;
  product_id: number;
  name: string;
  description: string;
  price: number;
  image_path: string;
}

interface Order {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
  status: string;
  user_email?: string;
  items: OrderItem[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-green-100 text-green-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const updateOrderStatus = async (orderId: number, newStatus: string) => {
  try {
    await axios.put(`http://localhost:8000/admin/orders/${orderId}/status`, {
      status: newStatus,
    });
    window.location.reload();
  } catch (error) {
    console.error("Failed to update order status:", error);
  }
};

function OrdersAdmin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

  const toggleOrderExpansion = (orderId: number) => {
    const newExpanded = new Set(expandedOrders);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedOrders(newExpanded);
  };

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "ID замовлення",
    },
    {
      accessorKey: "user_email",
      header: "Користувач",
      cell: ({ row }) => {
        const order = row.original;
        return order.user_email || `ID: ${order.user_id}`;
      },
    },
    {
      accessorKey: "created_at",
      header: "Дата створення",
      cell: ({ row }) => {
        const date = new Date(row.getValue("created_at"));
        return date.toLocaleDateString("uk-UA");
      },
    },
    {
      accessorKey: "total_amount",
      header: "Сума",
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("total_amount"));
        return `${amount} ₴`;
      },
    },
    {
      accessorKey: "status",
      header: "Статус",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return <Badge className={getStatusColor(status)}>{status}</Badge>;
      },
    },
    {
      accessorKey: "items",
      header: "Товари",
      cell: ({ row }) => {
        const order = row.original;
        const items = order.items;
        const isExpanded = expandedOrders.has(order.id);

        return (
          <div className="space-y-2">
            <button
              onClick={() => toggleOrderExpansion(order.id)}
              className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <span>{items.length} товар(ів)</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {isExpanded && (
              <div className="space-y-2 mt-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {item.image_path ? (
                        <img
                          src={`http://localhost:8000${item.image_path}`}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-600">
                          {item.quantity} × {item.price} ₴
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {(item.quantity * item.price)} ₴
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Дії",
      cell: ({ row }) => {
        const order = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="bg-gray-700 text-white shadow-2xl rounded-2xl"
            >
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "processing")}
                disabled={order.status === "processing"}
              >
                В обробці
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "shipped")}
                disabled={
                  order.status === "shipped" || order.status === "delivered"
                }
              >
                Відправлено
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "delivered")}
                disabled={order.status === "delivered"}
              >
                Доставлено
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => updateOrderStatus(order.id, "cancelled")}
                disabled={
                  order.status === "cancelled" || order.status === "delivered"
                }
              >
                Скасовано
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8000/admin/orders");
        setOrders(response.data.orders || []);
      } catch (e: any) {
        console.log(e);
        setError(e.response?.data?.error || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Завантаження замовлень...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-700 mb-6">
        Управління замовленнями
      </h1>
      <div className="bg-white rounded-lg shadow-md">
        <DataTable columns={columns} data={orders} input={true} />
      </div>
    </div>
  );
}

export default OrdersAdmin;