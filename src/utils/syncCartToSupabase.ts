import { supabase } from "@/libs/supabase";
import type { CartItem } from "@/context/CartContext";

export const syncCartToSupabase = async (
  userId: string,
  cart: CartItem []
) => {
  // 1. Cari cart aktif
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  let cartId = existingCart?.id;

  // 2. Kalau belum ada → buat cart
  if (!cartId) {
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ user_id: userId })
      .select()
      .single();

    cartId = newCart.id;
  }

  // 3. Simpan item cart
  for (const item of cart) {
    await supabase.from("cart_items").upsert({
      cart_id: cartId,
      product_id: item.productId,
      variant_id: item.variantId,
      size: item.attributes.size,
      color: item.attributes.color,
      price: item.price,
      qty: item.qty,
    });
  }
};
