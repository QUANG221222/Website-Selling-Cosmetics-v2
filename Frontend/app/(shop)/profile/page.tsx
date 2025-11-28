"use client";
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { fetchCurrentUser, selectCurrentUser, selectUserLoading } from '@/lib/redux/user/userSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Package, Settings, LogOut,Loader2, Eye, Truck, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { logoutUserApi } from '@/lib/redux/user/userSlice';
import { fetchUserOrders, orderSlice, selectOrders } from '@/lib/redux/order/orderSlice';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Order } from '@/lib/types';
import { orderApi } from '@/lib/api/order';
import { toast } from 'sonner';
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

const UserAccount = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const currentUser = useSelector(selectCurrentUser);
    const loading = useSelector(selectUserLoading);
    const orders = useSelector(selectOrders);
    
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  

  useEffect(() => {
    // Fetch user info khi component mount
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if(!orders || orders.length === 0) {
        dispatch(fetchUserOrders());
    }
  }, [dispatch]);

    const handleViewDetails = (order: Order) => {
      setSelectedOrder(order);
      setIsDetailDialogOpen(true);
    };

  const handleLogout = async () => {
    await dispatch(logoutUserApi());
    router.push('/')
  }
    const formatDate = (date: string | Date) => {
        const d = new Date(date);
        return d.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
        });
    };

    const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };
    const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', variant: 'secondary' as const, icon: Package },
      processing: { label: 'Đang xử lý', variant: 'default' as const, icon: Truck },
      completed: { label: 'Hoàn thành', variant: 'outline' as const, icon: CheckCircle },
      cancelled: { label: 'Đã hủy', variant: 'destructive' as const, icon: XCircle }
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
      paid: { label: 'Đã thanh toán', variant: 'outline' as const },
      unpaid: { label: 'Chưa thanh toán', variant: 'secondary' as const },
      failed: { label: 'Thanh toán thất bại', variant: 'destructive' as const }
    };
    
    const config = paymentConfig[status as keyof typeof paymentConfig];
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

    const handleDeleteOrder = async(_id: string) => {
        setOrderToCancel(_id);
        setShowCancelDialog(true);
    }

    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        try {
            await orderApi.cancelOrder(orderToCancel);
            toast.success("Đã hủy đơn hàng");
            setShowCancelDialog(false);
            setOrderToCancel(null)

            dispatch(fetchUserOrders());
        } catch (err) {
            toast.error("Hủy đơn hàng thất bại. Vui lòng thử lại.");
        }
    }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Vui lòng đăng nhập để xem thông tin</p>
        <Button onClick={() => router.push('/users/login')} className="mt-4">
          Đăng nhập
        </Button>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
                Bạn có chắc chắn muốn hủy đơn hàng này? Hành động không thể hoàn tác.
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelOrder} className="bg-destructive text-white">
                Xác nhận hủy
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-inter text-foreground">
          Tài Khoản Của Bạn
        </h1>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-destructive text-destructive hover:bg-destructive hover:text-white font-poppins"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Đăng xuất
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="font-poppins">
            <User className="h-4 w-4 mr-2" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="orders" className="font-poppins">
            <Package className="h-4 w-4 mr-2" />
            Lịch sử đơn hàng
          </TabsTrigger>
          <TabsTrigger value="settings" className="font-poppins">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground mt-3">
                Thông Tin Cá Nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-brand-pink text-foreground font-poppins text-lg">
                    {currentUser?.fullName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" className="border-brand-pink text-brand-deep-pink hover:bg-brand-pink font-poppins">
                  Thay đổi ảnh đại diện
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Họ và tên</Label>
                  <Input
                    value={currentUser?.fullName || ''}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Tên đăng nhập</Label>
                  <Input
                    value={currentUser.username || ''}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Email</Label>
                  <Input
                    value={currentUser.email || ''}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Số điện thoại</Label>
                  <Input
                    value={currentUser?.phone || ''}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
              </div>

              <Button className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins mb-3">
                Cập nhật thông tin
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground mt-3">
                Lịch Sử Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
                {orders.length > 0 ? (
                <div className="space-y-4">
                  {/* Desktop Table */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-inter">Mã đơn hàng</TableHead>
                          <TableHead className="font-inter">Ngày đặt</TableHead>
                          <TableHead className="font-inter">Tổng tiền</TableHead>
                          <TableHead className="font-inter">Trạng thái</TableHead>
                          <TableHead className="font-inter"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order?._id}>
                            <TableCell className="font-poppins font-medium">
                              #{order?._id}
                            </TableCell>
                            <TableCell className="font-inter">
                              {formatDate(order.createdAt)}
                            </TableCell>
                            <TableCell className="font-poppins font-medium text-brand-deep-pink">
                              {formatCurrency(order.totalAmount)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="font-poppins"
                                onClick={() =>handleViewDetails(order)}

                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Xem
                              </Button>
                            {order.status == 'pending' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="font-poppins text-destructive hover:bg-destructive hover:text-white"
                                onClick={() => handleDeleteOrder(order._id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Hủy
                              </Button>
                            )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {orders.map((order) => (
                      <Card key={order?._id} className="border-border">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="font-poppins font-medium text-foreground">
                                {order?._id}
                              </p>
                              <p className="text-muted-foreground font-inter">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>  
                            <Badge className={(order.status)}>
                              {(order.status)}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-poppins font-medium text-brand-deep-pink">
                              {formatCurrency(order.totalAmount)}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                             onClick={() =>handleViewDetails(order)}
                              className="border-brand-pink text-brand-deep-pink hover:bg-brand-pink font-poppins"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Xem chi tiết
                            </Button>
                          </div>
                          </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-inter">
                    Bạn chưa có đơn hàng nào.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground mt-3">
                Cài Đặt Tài Khoản
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-inter font-medium text-foreground">
                  Đổi mật khẩu
                </h3>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label className="font-inter font-medium">Mật khẩu hiện tại</Label>
                    <Input
                      type="password"
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-inter font-medium">Mật khẩu mới</Label>
                    <Input
                      type="password"
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-inter font-medium">Xác nhận mật khẩu mới</Label>
                    <Input
                      type="password"
                      className="bg-input-background border-border"
                    />
                  </div>
                  <Button className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins mb-3">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    <p><span className="font-medium">Tên:</span> {(currentUser.username)}</p>
                    <p><span className="font-medium">Người nhận:</span> {selectedOrder.receiverName}</p>
                    <p><span className="font-medium">SĐT:</span> {selectedOrder.receiverPhone}</p>
                    <p><span className="font-medium">Địa chỉ:</span> {selectedOrder.receiverAddress}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Thông tin đơn hàng</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Trạng thái:</span> {getStatusBadge(selectedOrder.status)}</p>
                    <p><span className="font-medium">Thanh toán:</span> {getPaymentBadge(selectedOrder.payment.status)}</p>
                    <p><span className="font-medium">Phương thức:</span> {selectedOrder.payment.method || 'N/A'}</p>
                    <p><span className="font-medium">Ngày đặt:</span> {formatDate(selectedOrder.createdAt)}</p>
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
                        <TableHead className="w-1/6 text-center">Số lượng</TableHead>
                        <TableHead className="w-1/6 text-right">Đơn giá</TableHead>
                       <TableHead className="w-1/6 text-right">Thành tiền</TableHead>
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
                                <div className="font-medium text-sm truncate max-w-[40ch]">{item.cosmeticName}</div>
                                <div className="text-xs text-muted-foreground truncate max-w-[40ch]">{item.cosmetic?.brand}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.subtotal)}</TableCell>
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
}
export default UserAccount;
