'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { categoryStats } from '@/data/mockData';

export default function PieRevenueChart() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
        <p className="text-muted-foreground">Đang tải...</p>
      </div>
    );
  }

  const COLORS = ['#F48FB1', '#81C784', '#FFD54F'];

  const safeData = categoryStats
    .map((item) => ({
      category: item.category || 'Unknown',
      revenue: Number(item.revenue) || 0,
      percentage: Number(item.percentage) || 0,
    }))
    .filter(item => item.revenue > 0);

  console.log('Safe data:', safeData);

  if (safeData.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: '100%', height: 300 }}>
        <p className="text-muted-foreground">Không có dữ liệu</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={safeData}
          dataKey="revenue"
          nameKey="category"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ category, percentage }) => `${category}: ${percentage}%`}
          labelLine={true}
        >
          {safeData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [
            new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value),
            'Doanh thu'
          ]}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}