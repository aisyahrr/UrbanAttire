import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/libs/supabase";
import type { ReactNode } from "react";
import Breadcrumb from "@/components/DashboardAdmin/components/Breadcrumb";

interface ProductImageRow {
    image_url: string;
    is_primary: boolean;
}

interface VariantColorRow {
    color: string;
}

interface ProductVariantRow {
    id: string;
    size: string;
    sku: string | null;
    stock: number;
    variant_colors: VariantColorRow[];
}

interface ProductCategoryRow {
    category_codes: {
        id: string;
        code: string;
        category: string;
    };
}

interface ProductDetailRow {
    id: string;
    name: string;
    description: string | null;
    price: number;
    code_product: string;
    product_images: ProductImageRow[];
    product_categories: ProductCategoryRow[];
    product_variants: ProductVariantRow[];
}
interface Color {
    id: string;
    name: string;
}

interface Variant {
    id: string;
    size: string;
    sku: string | null;
    stock: number;
    colors: Color[];
}

interface Category {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    code_product: string;
    images: string[];
    categories: Category[];
    variants: Variant[];
}

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    if (!id) return;

  const fetchProduct = async () => {
    setLoading(true);

        const { data, error } = await supabase
    .from("products")
    .select(`
        id,
        name,
        description,
        price,
        code_product,
        product_images (
        image_url,
        is_primary
        ),
        product_categories (
        category_codes (
            id,
            code,
            category
        )
        ),
        product_variants!product_variants_product_id_fkey (
        id,
        size,
        sku,
        stock,
        variant_colors!variant_colors_variant_id_fkey (
            color
        )
        )
    `)
    .eq("id", id)
    .single<ProductDetailRow>();

        if (error || !data) {
        console.error(error);
        setProduct(null);
        setLoading(false);
        return;
        }

        const images = [...data.product_images]
        .sort((a, b) => Number(b.is_primary) - Number(a.is_primary))
        .slice(0, 3)
        .map(img => img.image_url);

        const totalStock = data.product_variants.reduce(
        (sum, v) => sum + v.stock,
        0
        );

        setProduct({
        id: data.id,
        name: data.name,
        description: data.description,
        price: data.price,
        stock: totalStock,
        code_product: data.code_product,
        images,
        categories: data.product_categories.map(pc => ({
            id: pc.category_codes.id,
            name: pc.category_codes.category,
        })),
        variants: data.product_variants.map(v => ({
            id: v.id,
            size: v.size,
            sku: v.sku,
            stock: v.stock,
            colors: (v.variant_colors ?? []).map(c => ({
            id: c.color,
            name: c.color,
            })),
        })),
        });

        setLoading(false);
    };

    fetchProduct();
    }, [id]);

    if (loading) return <p className="p-4">Loading...</p>;
    if (!product)
        return <p className="p-4 text-red-500">Product tidak ditemukan</p>;

    const items = {
        Products: "/product",
        Product_details: "/product/product-details",
    };

    return (
        <div className="relative">
        <Breadcrumb items={items} />
        <div className="flex flex-col items-center py-3 gap-2 space-y-3">
            <div
                className="bg-white shadow rounded-xl p-5 gap-5 grid"
                style={{ gridTemplateColumns: "auto 1fr auto" }}
            >
                {/* IMAGE COLUMN */}
                <div className="flex flex-col gap-2">
                <div className="w-[260px] h-[250px]">
                    <img
                    src={product.images[0] ?? "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="w-[125px] h-[125px]">
                    <img
                        src={product.images[1] ?? "/placeholder.png"}
                        alt="Product image 2"
                        className="w-full h-full object-cover rounded-md"
                    />
                    </div>

                    <div className="w-[125px] h-[125px]">
                    <img
                        src={product.images[2] ?? "/placeholder.png"}
                        alt="Product image 3"
                        className="w-full h-full object-cover rounded-md"
                    />
                    </div>
                </div>
                </div>
                <div>
                    <h3 className="font-semibold pb-3">Deskripsi</h3>
                    <p className="text-justify">{product.description}</p>
                </div>
                {/* DESCRIPTION COLUMN */}
                <div className="max-w-[400px] space-y-2">
                    <dl className="space-y-3 mt-2">
                    <Info label="Nama Product" value={product.name} />
                    <Info
                    label="Harga"
                    value={`Rp. ${product.price.toLocaleString("id-ID")}`}
                    />
                    <Info label="Jumlah Stock" value={product.stock} />
                    <Info
                    label="Kategori"
                    value={product.categories.map((c) => c.name).join(", ")}
                    />
                    <Info label="Kode Product" value={product.code_product} />
                    </dl>
                </div>
            </div>

            {/* VARIANTS */}
            <div className="flex items-start gap-3">
                <div className="inline-block bg-white shadow rounded-md p-2">
                    <table className="w-fit table-auto">
                    <thead>
                        <tr className="bg-cyan-600 text-white text-left text-sm">
                        <th className="py-2 px-10">Size</th>
                        <th className="py-2 px-10">SKU</th>
                        <th className="py-2 px-10">Color</th>
                        <th className="py-2 px-10">Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                    {product.variants.map((v) => (
                        <tr key={v.id} className="border-b border-gray-200 text-[14px]">
                        {/* SIZE */}
                        <td className="py-3 px-10">{v.size}</td>

                        {/* SKU */}
                        <td className="py-3 px-10">{v.sku}</td>

                        {/* COLORS */}
                        <td className="py-2 px-10">
                            <div className="flex gap-1">
                            {v.colors.length > 0 ? (
                                v.colors.map((color) => (
                                <span
                                    key={color.id}
                                    className="inline-block w-4 h-4 rounded-full border"
                                    style={{ backgroundColor: color.name }}
                                    title={color.name.toUpperCase()}
                                />
                                ))
                            ) : (
                                <span className="text-gray-400">-</span>
                            )}
                            </div>
                        </td>

                        {/* STOCK */}
                        <td className="py-3 px-10">{v.stock}</td>
                        </tr>
                    ))}
                    </tbody>

                    </table>
                </div>
                <div className="flex flex-col gap-2">
                    <button  className="w-auto bg-primary hover:bg-secondary text-white text-sm py-2 px-4 rounded-md transition duration-200">Edit product</button>
                    <button  className="w-auto bg-primary hover:bg-secondary text-white text-sm py-2 px-4 rounded-md transition duration-200">Hapus product</button>
                </div>
            </div>
        </div>
        </div>
    );
};

interface InfoProps {
    label: string;
    value: ReactNode;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
    <div className="flex">
        <dt className="w-40 font-semibold">{label}</dt>
        <dd>: {value}</dd>
    </div>
);

export default ProductDetails;
