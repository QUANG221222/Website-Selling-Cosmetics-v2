"use client";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { fetchCurrentUser, selectCurrentUser, selectUserLoading } from '@/lib/redux/user/userSlice';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector(selectCurrentUser);
  const loading = useSelector(selectUserLoading);

  useEffect(() => {
    // Fetch user info khi component mount
    if (!currentUser) {
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, currentUser]);

  if (loading) {
    return <div>Đang tải thông tin...</div>;
  }

  if (!currentUser) {
    return <div>Vui lòng đăng nhập</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback>
              {currentUser.fullName?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{currentUser.fullName}</h3>
            <p className="text-sm text-muted-foreground">@{currentUser.username}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">Email:</span>
            <span>{currentUser.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Vai trò:</span>
            <span>{currentUser.role === 'customer' ? 'Khách hàng' : 'Quản trị viên'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Trạng thái:</span>
            <span>{currentUser.isActive ? 'Đang hoạt động' : 'Chưa kích hoạt'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;