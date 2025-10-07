"use client"
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Search, UserPlus, Edit, Trash2, Filter } from "lucide-react";
import { mockUsers } from "@/data/mockData";
import { User } from "@/lib/types/index";

const UsersManagement = () => {

  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);


  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && user.isActive) ||
                         (statusFilter === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleCreateUser = () => {
    const newUser: User = {
        _id: `c${Date.now()}`,
        email: "",
        username: "",
        fullName: "",
        role: "",
        isActive: true,
        phone: "",
        gender: "",
        dob: new Date(),
        avatar: "",
        createdAt: new Date(),
    };
    setSelectedUser(newUser);
    setIsCreateDialogOpen(true);
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(users.map(user => 
        user._id === selectedUser._id ? selectedUser : user
      ));
      setIsEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user._id !== userId));
  };

    const handleSaveUser = () => {
    if (selectedUser) {
      if (isCreateDialogOpen) {
        setUsers([...users, selectedUser]);
        setIsCreateDialogOpen(false);
      } else {
        setUsers(users.map(user => 
          user._id === selectedUser._id ? { ...selectedUser, updatedAt: new Date() } : user
        ));
        setIsEditDialogOpen(false);
      }
      setSelectedUser(null);
    }
  };
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user._id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Quản lý tài khoản người dùng</CardTitle>
          <CardDescription>
            Quản lý thông tin và trạng thái tài khoản của khách hàng
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả vai trò</SelectItem>
                <SelectItem value="customer">Khách hàng</SelectItem>
                <SelectItem value="admin">Quản trị viên</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Đã tạm khóa</SelectItem>
              </SelectContent>
            </Select>

            <Button
                onClick={handleCreateUser}
            >
                <UserPlus className="h-4 w-4 mr-2" />
                Thêm người dùng
            </Button>

            {/* <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Thêm người dùng</DialogTitle>
                    <DialogDescription>
                   Thêm thông tin và trạng thái tài khoản người dùng.
                    </DialogDescription>
                </DialogHeader>
                {selectedUser && (
                    <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                        Họ tên
                        </Label>
                        <Input
                        id="fullName"
                        value={selectedUser.fullName}
                        onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                        Email
                        </Label>
                        <Input
                        id="email"
                        value={selectedUser.email}
                        onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                        Số điện thoại
                        </Label>
                        <Input
                        id="phone"
                        value={selectedUser.phone || ''}
                        onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                        className="col-span-3"
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                        Vai trò
                        </Label>
                        <Select 
                        value={selectedUser.role} 
                        onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                        >
                        <SelectTrigger className="col-span-3">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="customer">Khách hàng</SelectItem>
                            <SelectItem value="admin">Quản trị viên</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="isActive" className="text-right">
                        Trạng thái
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                        <Switch
                            id="isActive"
                            checked={selectedUser.isActive}
                            onCheckedChange={(checked) => setSelectedUser({...selectedUser, isActive: checked})}
                        />
                        <Label htmlFor="isActive">
                            {selectedUser.isActive ? 'Hoạt động' : 'Tạm khóa'}
                        </Label>
                        </div>
                    </div>
                    </div>
                )}
          <DialogFooter>
            <Button type="submit" onClick={handleUpdateUser}>
              Tạo mới
            </Button>
          </DialogFooter>
        </DialogContent>
            </Dialog> */}

          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày đăng ký</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.fullName} />
                          <AvatarFallback>
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullName}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role === 'admin' ? 'Quản trị' : 'Khách hàng'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => toggleUserStatus(user._id)}
                        />
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Hoạt động' : 'Tạm khóa'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user._id)}
                          disabled={user.role === 'admin'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Hiển thị {filteredUsers.length} / {users.length} người dùng
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit/ Add User Dialog */}
      <Dialog open={isEditDialogOpen ||isCreateDialogOpen } 
                onOpenChange={() => {
                        setIsEditDialogOpen(false);
                        setIsCreateDialogOpen(false);
                        setSelectedUser(null);
                    
                    }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin người dùng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin và trạng thái tài khoản người dùng.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Họ tên
                </Label>
                <Input
                  id="fullName"
                  value={selectedUser.fullName}
                  onChange={(e) => setSelectedUser({...selectedUser, fullName: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={selectedUser.phone || ''}
                  onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Vai trò
                </Label>
                <Select 
                  value={selectedUser.role} 
                  onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">Khách hàng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Trạng thái
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={selectedUser.isActive}
                    onCheckedChange={(checked) => setSelectedUser({...selectedUser, isActive: checked})}
                  />
                  <Label htmlFor="isActive">
                    {selectedUser.isActive ? 'Hoạt động' : 'Tạm khóa'}
                  </Label>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleSaveUser}>
              {isCreateDialogOpen ? 'Thêm người dùng' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default UsersManagement;