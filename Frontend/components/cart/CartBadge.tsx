"use client";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AppDispatch } from "@/lib/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/redux/user/userSlice";
import { fetchCart, selectCartTotalItems } from "@/lib/redux/cart/cartSlice";
import { useEffect } from "react";

const CartBadge = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const cartItemCount = useSelector(selectCartTotalItems);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        // Only fetch cart if user is logged in
        if (currentUser) {
            dispatch(fetchCart());
        }
    }), [dispatch, currentUser];

    const handleCartClick = () => {
        router.push('/cart')
    }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick= {handleCartClick}
        aria-label="Shopping cart"
        className="relative cursor-pointer">
        <ShoppingCart className="h-5 w-5" />
        {cartItemCount > 0 && (
            <Badge
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-brand-deep-pink text-white text-xs"
                variant="default"
            >
                {cartItemCount > 99 ? '99+' : cartItemCount}
            </Badge>
        )}
      </Button>
    </>
  );
};

export default CartBadge;
