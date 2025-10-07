import { 
    Card, 
    CardTitle, 
    CardDescription, 
    CardHeader, 
    CardContent 
} from "@/components/ui/card";
import { Settings } from "lucide-react";

const Setting = () => {

    return (
         <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Cài đặt hệ thống
              </CardTitle>
              <CardDescription>
                Quản lý cấu hình và thiết lập hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Trang cài đặt đang được phát triển
                </p>
              </div>
            </CardContent>
          </Card>
        ); 
}
export default Setting;