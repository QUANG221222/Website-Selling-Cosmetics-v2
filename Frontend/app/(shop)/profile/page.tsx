import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Package, Settings, LogOut, Eye } from 'lucide-react';


const UserAccount = () => {

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-inter text-foreground">
          Tài Khoản Của Bạn
        </h1>
        <Button
          variant="outline"
        //   onClick={onLogout}
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
              <CardTitle className="font-inter text-foreground">
                Thông Tin Cá Nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-brand-pink text-foreground font-poppins text-lg">
                    {/* {user?.name.charAt(0).toUpperCase()} */}
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
                    // value={user?.name}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Email</Label>
                  <Input
                    // value={user?.email}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-inter font-medium">Số điện thoại</Label>
                  <Input
                    // value={user?.phone}
                    className="bg-input-background border-border"
                    disabled
                  />
                </div>
              </div>

              <Button className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins">
                Cập nhật thông tin
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground">
                Lịch Sử Đơn Hàng
              </CardTitle>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-inter text-foreground">
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
                  <Button className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins">
                    Cập nhật mật khẩu
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default UserAccount;
