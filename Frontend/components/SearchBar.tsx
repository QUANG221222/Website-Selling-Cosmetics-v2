
import { 
  Search,

} from 'lucide-react';
import { Input } from '@/components/ui/input';
const SearchBar = () => {
  return (
    <form className="hidden md:flex items-center space-x-2">
        <div className="relative">
            <Input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                // value={searchQuery}
                // onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 bg-input-background border-border"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
    </form>
  )
}

export default SearchBar
