"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Order } from "@/lib/types/index";
import { AppDispatch } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, selectOrders } from "@/lib/redux/order/orderSlice";
import {
  fetchAllOrdersWithPagination,
  selectOrderPagination,
  setPaginationPage,
  selectOrderLoading,
  updateOrder,
} from "@/lib/redux/order/orderSlice";
import {
  CheckCircle,
  Eye,
  Package,
  Search,
  Truck,
  XCircle,
  Loader2,
} from "lucide-react";
import { selectAllUsers, fetchALlUsers } from "@/lib/redux/user/userSlice";

const OrdersManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders);
  const pagination = useSelector(selectOrderPagination);
  const users = useSelector(selectAllUsers);
  const loading = useSelector(selectOrderLoading);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(fetchALlUsers());
  }, [dispatch]);
  // Fetch orders khi page hoặc pageSize thay đổi
  useEffect(() => {
    dispatch(
      fetchAllOrdersWithPagination({
        page: currentPage,
        limit: pageSize,
        sortBy: "createdAt",
        sortOrder: "desc",
      })
    );
  }, [dispatch, currentPage, pageSize]);


  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.receiverPhone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesPayment =
      paymentFilter === "all" || order.payment.status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });
  console.log("Filtered orders: ", filteredOrders);
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi page size
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    // Gọi API để cập nhật trạng thái đơn hàng
    await dispatch(
      updateOrder({
        orderId,
        data: {
          status: newStatus,
        },
      })
    );
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailDialogOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status: Order["status"]) => {
    const statusConfig = {
      pending: {
        label: "Chờ xử lý",
        variant: "secondary" as const,
        icon: Package,
      },
      processing: {
        label: "Đang xử lý",
        variant: "default" as const,
        icon: Truck,
      },
      completed: {
        label: "Hoàn thành",
        variant: "outline" as const,
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        variant: "destructive" as const,
        icon: XCircle,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (status: string) => {
    const paymentConfig = {
      paid: { label: "Đã thanh toán", variant: "outline" as const },
      unpaid: { label: "Chưa thanh toán", variant: "secondary" as const },
      failed: { label: "Thanh toán thất bại", variant: "destructive" as const },
    };

    const config = paymentConfig[status as keyof typeof paymentConfig];

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    return user ? user.fullName : "N/A";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="pt-2">Quản lý đơn hàng</CardTitle>
          <CardDescription>
            Theo dõi và quản lý trạng thái đơn hàng của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đơn, tên người nhận hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái đơn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="processing">Đang xử lý</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Thanh toán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="paid">Đã thanh toán</SelectItem>
                <SelectItem value="unpaid">Chưa thanh toán</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>Người nhận</TableHead>
                  <TableHead>Tổng tiền</TableHead>
                  <TableHead>Trạng thái đơn</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ngày đặt</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        #{order._id}
                      </TableCell>
                      <TableCell>{getUserName(order.userId)}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.receiverName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.receiverPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {getPaymentBadge(order.payment.status)}
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {order.status === "pending" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(order._id, "processing")
                              }
                            >
                              Xử lý
                            </Button>
                          )}
                          {order.status === "processing" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusUpdate(order._id, "completed")
                              }
                            >
                              Hoàn thành
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Không tìm thấy đơn hàng nào
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Hiển thị {filteredOrders.length} / {pagination.totalCount} đơn
                hàng
              </span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => handlePageSizeChange(parseInt(val))}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePageChange(currentPage - 1);
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {/* Page Numbers */}
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1
                ).map((page) => {
                  // Hiển thị trang gần hiện tại
                  if (
                    page === 1 ||
                    page === pagination.totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={page}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < pagination.totalPages)
                        handlePageChange(currentPage + 1);
                    }}
                    className={
                      currentPage === pagination.totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="w-full max-w-full sm:max-w-[720px] max-h-[90vh] overflow-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?._id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng và sản phẩm
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Thông tin khách hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Tên:</span>{" "}
                      {getUserName(selectedOrder.userId)}
                    </p>
                    <p>
                      <span className="font-medium">Người nhận:</span>{" "}
                      {selectedOrder.receiverName}
                    </p>
                    <p>
                      <span className="font-medium">SĐT:</span>{" "}
                      {selectedOrder.receiverPhone}
                    </p>
                    <p>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {selectedOrder.receiverAddress}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Thông tin đơn hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium">Trạng thái:</span>{" "}
                      {getStatusBadge(selectedOrder.status)}
                    </p>
                    <p>
                      <span className="font-medium">Thanh toán:</span>{" "}
                      {getPaymentBadge(selectedOrder.payment.status)}
                    </p>
                    <p>
                      <span className="font-medium">Phương thức:</span>{" "}
                      {selectedOrder.payment.method || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Ngày đặt:</span>{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="font-medium mb-2">Sản phẩm trong đơn hàng</h4>
                <div className="border rounded-lg overflow-auto max-h-[40vh]">
                  <Table className="min-w-full">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Sản phẩm</TableHead>
                        <TableHead className="w-1/6 text-center">
                          Số lượng
                        </TableHead>
                        <TableHead className="w-1/6 text-right">
                          Đơn giá
                        </TableHead>
                        <TableHead className="w-1/6 text-right">
                          Thành tiền
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.cosmeticImage}
                                alt={item.cosmeticName}
                                className="w-10 h-10 object-contain rounded"
                              />
                              <div className="min-w-0">
                                <div className="font-medium text-sm truncate max-w-[40ch]">
                                  {item.cosmeticName}
                                </div>
                                <div className="text-xs text-muted-foreground truncate max-w-[40ch]">
                                  {item.cosmetic?.brand}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.price)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(item.subtotal)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Order Total */}
              <div className="flex justify-end">
                <div className="text-right">
                  <div className="text-lg font-medium">
                    Tổng cộng: {formatCurrency(selectedOrder.totalAmount)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default OrdersManagement;
