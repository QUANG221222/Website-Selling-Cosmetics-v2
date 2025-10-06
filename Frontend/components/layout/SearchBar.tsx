
import { 
  Search,

} from 'lucide-react';
import { Input } from '@/components/ui/input';
const SearchBar = () => {
  return (
    <form className="hidden md:flex items-center space-x-2 pr-10 ">
        <div className="relative">
            <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 bg-input-background border-border"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground cursor-pointer" />
        </div>
    </form>
  )
}

export default SearchBar
