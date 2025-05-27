import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "~/redux/slices/authSlice";
import {
  Camera,
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  MoreHorizontal,
  Badge,
} from "lucide-react";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "~/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import DataTable from "~/components/DataTable";
import { fetchUserOrders, selectOrder } from "~/redux/slices/orderSlice";
import type { AppDispatch } from "~/redux/store";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  phone_number?: string;
  created_at: string;
}
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

function Profile() {
  const { user } = useSelector(selectAuth);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // const [order,setOrder] = useState<Order[]>([])
  const { orders } = useSelector(selectOrder);
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
  });

  useEffect(() => {
    fetchProfile();
    dispatch(fetchUserOrders());
  }, []);

  const fetchProfile = async () => {
    try {
      // Якщо у вас є API для профілю
      // const response = await axios.get('http://localhost:8000/auth/profile');
      // setProfile(response.data.user);

      // Поки що використовуємо дані з Redux
      if (user) {
        const mockProfile = {
          ...user,
          phone_number: "+380 12 345 67 89",
          created_at: "2024-01-15T10:30:00Z",
        };
        setProfile(mockProfile);
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone_number: "+380 12 345 67 89",
        });
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Файл занадто великий. Максимальний розмір: 5MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Недопустимий тип файлу. Дозволені: JPEG, PNG, GIF, WebP");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);
      const response = await axios.post(
        "http://localhost:8000/upload/avatar",
        formData
      );

      setProfile((prev) =>
        prev ? { ...prev, avatar: response.data.avatar_url } : null
      );
    } catch (error: any) {
      console.error("Upload failed:", error);
      alert("Помилка завантаження");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put("http://localhost:8000/auth/profile", formData);
      setProfile((prev) => (prev ? { ...prev, ...formData } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Помилка оновлення профілю");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name,
        email: profile.email,
        phone_number: profile.phone_number || "",
      });
    }
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        return `${amount.toFixed(2)} $`;
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
        const items = row.getValue("items") as OrderItem[];
        return `${items.length} товар(ів)`;
      },
    },
  ];

  // useEffect(() => {
  //   const fetchOrders = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get("http://localhost:8000/admin/orders");
  //       setOrder(response.data.orders || []);
  //     } catch (e: any) {
  //       console.log(e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchOrders();
  // }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Профіль не знайдено
          </h2>
          <p className="text-gray-500">Спробуйте оновити сторінку</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
                  Мій профіль
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="bg-white overflow-hidden shadow-lg rounded-xl">
            <div className="px-6 py-8">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={`http://localhost:8000${profile.avatar}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white text-2xl font-bold">❗</span>
                    )}
                  </div>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute -bottom-1 -right-1 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-md transition-colors duration-200 disabled:opacity-50"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.name}
                  </h2>
                  <p className="text-gray-500">{profile.email}</p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    Зареєстрований {formatDate(profile.created_at)}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Зберегти
                      </button>
                      <button
                        onClick={handleCancel}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Скасувати
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Редагувати
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Особиста інформація
              </h3>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 mr-2" />
                    Повне ім'я
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Введіть ваше ім'я"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {profile.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Email адреса
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Введіть ваш email"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {profile.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Phone className="w-4 h-4 mr-2" />
                    Номер телефону
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone_number: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Введіть ваш номер телефону"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                      {profile.phone_number || "Не вказано"}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4 mr-2" />
                    Дата реєстрації
                  </label>
                  <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-900">
                    {formatDate(profile.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Статистика аккаунту
              </h3>
            </div>

            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-sm text-gray-600">Замовлень</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ₴2,450
                  </div>
                  <div className="text-sm text-gray-600">Загальна сума</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-600">Відгуків</div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Замовлення</h3>
            </div>
            <div className="bg-white rounded-lg shadow-md">
              <DataTable columns={columns} data={orders} input={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
