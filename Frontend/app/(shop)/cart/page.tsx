import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from "next/image"

const ShoppingCart =() => {

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-inter text-foreground mb-8">
          Giỏ Hàng Của Bạn
        </h1>
        
        <Card className="text-center py-12 border-border">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="font-inter font-medium text-foreground">
                Giỏ hàng của bạn đang trống
              </h3>
              <p className="text-muted-foreground font-inter">
                Hãy thêm một số sản phẩm yêu thích vào giỏ hàng của bạn.
              </p>
            </div>
            <Button
            //   onClick={onContinueShopping}
              className="bg-brand-deep-pink hover:bg-brand-deep-pink/90 text-white font-poppins"
            >
              Tiếp tục mua sắm
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

//   
export default ShoppingCart;