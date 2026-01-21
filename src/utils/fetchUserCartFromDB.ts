import { supabase } from "@/libs/supabase";
import type { CartItem } from "@/context/CartContext";
import type { DBCartItemRow } from "@/types/types";

export const fetchUserCartFromDB = async (
  userId: string
): Promise<CartItem[]> => {
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (!cart) return [];

  const { data: rows } = await supabase
    .from("cart_items")
    .select(`
      qty,
      product_variants (
        id,
        size,
        stock,
        price,
        product:products (
          id,
          name,
          product_images ( url )
        ),
        variant_colors ( color )
      )
    `)
    .eq("cart_id", cart.id);

  if (!rows) return [];

  return (rows as unknown as DBCartItemRow[]).map((row) => ({
    productId: row.product_variants.product.id,
    variantId: row.product_variants.id,

    name: row.product_variants.product.name,
    image:
      row.product_variants.product.product_images[0]?.url ?? "",

    price: row.product_variants.price,
    stock: row.product_variants.stock,

    attributes: {
      size: row.product_variants.size,
      color: row.product_variants.variant_colors[0]?.color ?? "",
    },

    qty: row.qty,
    selected: true,
  }));
};
