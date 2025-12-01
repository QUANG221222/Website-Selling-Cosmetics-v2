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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  deleteOrder,
} from "@/lib/redux/order/orderSlice";
import {
  CheckCircle,
  Eye,
  Package,
  Search,
  Truck,
  XCircle,
  Loader2,
  Edit,
  Trash2,
} from "lucide-react";
import { selectAllUsers, fetchALlUsers } from "@/lib/redux/user/userSlice";
import { toast } from "sonner";

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
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orderToUpdate, setOrderToUpdate] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<Order["status"]>("pending");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(fetchALlUsers());
  }, [dispatch]);

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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  const handleStatusUpdate = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
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

  const handleOpenUpdateDialog = (order: Order) => {
    setOrderToUpdate(order);
    setNewStatus(order.status);
    setIsUpdateStatusDialogOpen(true);
  };

  const handleConfirmUpdateStatus = async () => {
    if (!orderToUpdate) return;

    try {
      await dispatch(
        updateOrder({
          orderId: orderToUpdate._id,
          data: {
            status: newStatus,
          },
        })
      ).unwrap();

      toast.success("Cập nhật trạng thái đơn hàng thành công");
      setIsUpdateStatusDialogOpen(false);
      setOrderToUpdate(null);
    } catch (error) {
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleOpenDeleteDialog = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!orderToDelete) return;

    try {
      await dispatch(deleteOrder(orderToDelete)).unwrap();
      toast.success("Xóa đơn hàng thành công");
      setIsDeleteDialogOpen(false);
      setOrderToDelete(null);

      // Refresh data
      dispatch(
        fetchAllOrdersWithPagination({
          page: currentPage,
          limit: pageSize,
          sortBy: "createdAt",
          sortOrder: "desc",
        })
      );
    } catch (error) {
      toast.error("Xóa đơn hàng thất bại");
    }
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

  // Helper function to truncate order ID
  const truncateOrderId = (orderId: string) => {
    if (orderId.length <= 10) return orderId;
    return `#${orderId.substring(0, 8)}...`;
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
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">Mã đơn hàng</TableHead>
                  <TableHead className="w-[150px]">Khách hàng</TableHead>
                  <TableHead className="w-[180px]">Người nhận</TableHead>
                  <TableHead className="w-[120px]">Tổng tiền</TableHead>
                  <TableHead className="w-[120px]">Trạng thái đơn</TableHead>
                  <TableHead className="w-[130px]">Thanh toán</TableHead>
                  <TableHead className="w-[160px]">Ngày đặt</TableHead>
                  <TableHead className="w-[200px] text-right">
                    Thao tác
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="cursor-help">
                                {truncateOrderId(order._id)}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>#{order._id}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="truncate max-w-[150px]">
                        {getUserName(order.userId)}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium truncate max-w-[180px]">
                            {order.receiverName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.receiverPhone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {getPaymentBadge(order.payment.status)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatDate(order.createdAt)}
                      </TableCell>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenUpdateDialog(order)}
                            className="border-brand-pink text-brand-deep-pink hover:bg-brand-pink"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDeleteDialog(order._id)}
                            className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
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
                  <SelectItem value="8">8</SelectItem>
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

      {/* Update Status Dialog */}
      <Dialog
        open={isUpdateStatusDialogOpen}
        onOpenChange={setIsUpdateStatusDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
            <DialogDescription>
              Thay đổi trạng thái cho đơn hàng #{orderToUpdate?._id}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Trạng thái hiện tại</Label>
              <div className="flex items-center">
                {orderToUpdate && getStatusBadge(orderToUpdate.status)}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái mới</Label>
              <Select
                value={newStatus}
                onValueChange={(value) =>
                  setNewStatus(value as Order["status"])
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Chờ xử lý
                    </div>
                  </SelectItem>
                  <SelectItem value="processing">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Đang xử lý
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Hoàn thành
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Đã hủy
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateStatusDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              onClick={handleConfirmUpdateStatus}
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90"
            >
              Xác nhận
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể
              hoàn tác và tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOrderToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa đơn hàng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Order Details Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng #{selectedOrder?._id}</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đơn hàng và sản phẩm
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="overflow-y-auto flex-1 px-1">
              <div className="space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="border rounded-lg overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[200px]">
                            Sản phẩm
                          </TableHead>
                          <TableHead className="text-center">
                            Số lượng
                          </TableHead>
                          <TableHead className="text-right">Đơn giá</TableHead>
                          <TableHead className="text-right">
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
                                  <div className="font-medium text-sm">
                                    {item.cosmeticName}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {item.cosmetic?.brand}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              {item.quantity}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-right whitespace-nowrap">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
