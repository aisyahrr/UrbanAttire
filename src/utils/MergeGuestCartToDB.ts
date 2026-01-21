import { supabase } from "../libs/supabase";
import type { CartItem } from "../context/CartContext";

const CART_STORAGE_KEY = "urban_cart_v1";

/**
 * Ambil cart guest dari localStorage
 */
const getGuestCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/**
 * Ambil atau buat active cart user
 */
const getOrCreateActiveCart = async (userId: string): Promise<string> => {
  const { data: existingCart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (existingCart?.id) {
    return existingCart.id;
  }

  const { data: newCart, error } = await supabase
    .from("carts")
    .insert({
      user_id: userId,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !newCart) {
    throw new Error("Gagal membuat cart baru");
  }

  return newCart.id;
};

/**
 * Merge guest cart → DB cart
 */
export const mergeGuestCartToDB = async (userId: string) => {
  const guestCart = getGuestCart();
  if (!guestCart.length) return;

  const cartId = await getOrCreateActiveCart(userId);

  for (const item of guestCart) {

    const { data: variant } = await supabase
      .from("product_variants")
      .select("id, stock")
      .eq("id", item.variantId)
      .single();

    if (!variant) continue;


    const finalQty = Math.min(item.qty, variant.stock);

    if (finalQty < 1) continue;

 
    await supabase.from("cart_items").upsert(
      {
        cart_id: cartId,
        variant_id: item.variantId,
        qty: finalQty,
      },
      {
        onConflict: "cart_id,variant_id",
      }
    );
  }
  localStorage.removeItem(CART_STORAGE_KEY);
};
