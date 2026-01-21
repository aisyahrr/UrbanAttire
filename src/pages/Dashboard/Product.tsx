import { useEffect, useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import type { TProduct } from "@/types/types";
import Breadcrumb from "@/components/DashboardAdmin/components/Breadcrumb";
import { COLOR_OPTIONS, type ProductType } from "@/constants/productOptions";
import { FaPlus } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { FaTrashCan } from "react-icons/fa6";
import { supabase } from "@/libs/supabase";
import toast from "react-hot-toast";

interface Variant {
    id?: string;       
    size: string;
    sku: string;       
    stock: number | ""; 
    colors: string[];
}
interface ProductForm {
    name: string;
    description: string;
    price: number | "";       
    old_price: number | "";
    discount: number | "";
    category: string;
}
type CategoryOption = {
    id: string;
    code: CategoryCode;
    category: string;
};
// DIMENSI YANG MEMPENGARUHI SIZE
type ProductDimension = "TOP" | "BOT" | "SHO" | "DRS" | "BAG";

// SEMUA CATEGORY CODE DI DB
type CategoryCode =
    | ProductDimension
    | "OUT"
    | "GEN"
    | "STY"
    | "MAT";

const Products: React.FC = () => {
    const [products, setProducts] = useState<TProduct[]>([]);
    const [shopCode, setShopCode] = useState("");
    const [productType, setProductType] =
        useState<ProductType>("shirt");
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [availableCategories, setAvailableCategories] = useState<CategoryOption[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const [variants, setVariants] = useState<Variant[]>([
        { size: "", sku: "", stock: 0, colors: [] },
    ]);
    const [form, setForm] = useState<ProductForm>({
        name: "",
        description: "",
        price: "",
        old_price: "",
        discount: "",
        category: "",
    });
    // product
    useEffect(() => {
    const fetchProducts = async () => {
        setLoading(true);

        const { data: authData, error: authError } =
        await supabase.auth.getUser();

        if (authError || !authData.user) {
        toast.error("User belum login");
        setLoading(false);
        return;
        }

        const { data: shop, error: shopError } = await supabase
        .from("shops")
        .select("id, code")
        .eq("owner_id", authData.user.id)
        .single();

        if (shopError || !shop) {
        toast.error("Shop tidak ditemukan");
        setLoading(false);
        return;
        }

        setShopCode(shop.code);

        const { data: productsData, error: productError } =
        await supabase
            .from("products")
            .select(`
            id,
            name,
            price,
            discount,
            product_images (image_url, is_primary),
            product_categories (
                category_codes (
                category,
                code
                )
            )
            `)
            .eq("shop_id", shop.id);
    
        if (productError || !productsData) {
        toast.error("Gagal memuat products");
        setLoading(false);
        return;
        }

        let stocks: { product_id: string; total_stock: number }[] = [];

        if (productsData.length > 0) {
        const res = await supabase
            .from("product_stock_summary")
            .select("product_id, total_stock")
            .in("product_id", productsData.map(p => p.id));

        stocks = res.data ?? [];
        }

        const merged = productsData.map(p => ({
        ...p,
        total_stock:
            stocks.find(s => s.product_id === p.id)?.total_stock ?? 0
        }));

        setProducts(merged);
        setLoading(false);
    };

    fetchProducts();
    }, []);
    // category → product type
    const CATEGORY_CODE_TO_PRODUCT_TYPE: Record<ProductDimension, ProductType> =
    useMemo(() => ({
        TOP: "shirt",
        BOT: "pants",
        SHO: "shoes",
        DRS: "shirt",
        BAG: "shirt",
    }), []);
    useEffect(() => {
    const fetchCategories = async () => {
        const { data, error } = await supabase
        .from("category_codes")
        .select("id, code, category")
        .order("category");

        if (!error) {
        setAvailableCategories(data ?? []);
        }
    };

    fetchCategories();
    }, []);

    useEffect(() => {
    const selected = availableCategories.filter(c =>
        selectedCategories.includes(c.id)
    );

    const dimension = selected.find(c =>
        ["TOP", "BOT", "SHO", "DRS", "BAG"].includes(c.code)
    );

    setProductType(
        dimension
        ? CATEGORY_CODE_TO_PRODUCT_TYPE[dimension.code as ProductDimension]
        : "shirt"
    );
    }, [selectedCategories, availableCategories,CATEGORY_CODE_TO_PRODUCT_TYPE ]);
    // discount 
    useEffect(() => {
    if (form.old_price !== "" && form.discount !== "") {
        const finalPrice =
        Number(form.old_price) -
        (Number(form.old_price) * Number(form.discount)) / 100;

        const roundedPrice = Math.ceil(finalPrice / 1000) * 1000;

        setForm(prev => ({
        ...prev,
        price: roundedPrice,
        }));
    }
    }, [form.old_price, form.discount]);


    // Handle form input
    const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
    const { name, value, type } = e.target;

    setForm((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
    }));
    if (name === "name" && shopCode) {
        const productCode = generateProductCode(String(value));

        setVariants((prev) => {
        const next = [...prev];
        return next.map((v) => ({
            ...v,
            sku: v.size
            ? generateSKU(
                shopCode,
                productCode,
                v.size
                )
            : "",
        }));
        });
    }
    };
    const rollbackProduct = async (productId: string) => {
        await supabase
            .from("products")
            .delete()
            .eq("id", productId);
    };
    // const normalizedCategories = Array.from(
    //     new Set(categories.map(c => c.trim().toLowerCase()))
    // );
    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
        toast.error("Minimal 1 gambar");
        return;
    }

    try {
        /* ================= AUTH ================= */
        const { data: auth } = await supabase.auth.getUser();
        if (!auth.user) {
        toast.error("User belum login");
        return;
        }

        /* ================= SHOP ================= */
        const { data: shop, error: shopError } = await supabase
        .from("shops")
        .select("id")
        .eq("owner_id", auth.user.id)
        .single();

        if (shopError || !shop) {
        toast.error("Shop tidak ditemukan");
        return;
        }

        /* ================= CATEGORY VALIDATION ================= */
        if (selectedCategories.length === 0) {
        toast.error("Minimal pilih 1 category");
        return;
        }

        /* ================= PRODUCT ================= */

        // PRIMARY CATEGORY = code pertama
        const primaryCategoryId = selectedCategories[0];

        const { data: product, error: productError } = await supabase
        .from("products")
        .insert({
            shop_id: shop.id,
            name: form.name,
            description: form.description,
            price: form.price,
            old_price: form.old_price || null,
            discount: form.discount === "" ? null : form.discount,
            primary_category: primaryCategoryId, 
            is_active: true,
        })
        .select()
        .single();

        if (productError || !product) {
        toast.error("Gagal menambahkan product");
        return;
        }

        /* ================= PRODUCT CATEGORIES ================= */
        const categoryRows = selectedCategories.map(category_id => ({
        product_id: product.id,
        category_id
        }));
        const { error: categoryError } = await supabase
            .from("product_categories")
            .insert(categoryRows);

            if (categoryError) {
            console.error(categoryError);
            toast.error("Gagal menyimpan category");
            return;
            }

        /* ================= IMAGES ================= */
        await Promise.all(
        images.map(async (image, index) => {
            const path = `${product.id}/${Date.now()}-${index}.jpg`;

            await supabase.storage
            .from("product-images")
            .upload(path, image, { upsert: true });

            const { data } = supabase.storage
            .from("product-images")
            .getPublicUrl(path);

            return supabase.from("product_images").insert({
            product_id: product.id,
            image_url: data.publicUrl,
            is_primary: index === 0,
            });
        })
        );

        const productCode = generateProductCode(form.name);
        const variantsWithSku = variants.map(v => ({
        ...v,
        sku: generateSKU(
            shopCode,
            productCode,
            v.size
        )
        }));
        const validVariants = variantsWithSku.filter(
            v => v.size && v.sku && v.colors.length > 0
        );
        if (validVariants.some(v => !v.sku)) {
            toast.error("SKU gagal digenerate");
            return;
        }
        /* ================= VARIANTS ================= */
        const { data: insertedVariants, error: variantError } =
        await supabase
            .from("product_variants")
            .insert(
            validVariants.map(v => ({
                product_id: product.id,
                size: v.size,
                sku: v.sku,  
                stock: Number(v.stock),
            }))
            )
            .select();

        if (variantError || !insertedVariants) {
        await rollbackProduct(product.id);
        toast.error("Variant gagal, product dibatalkan");
        return;
        }

        const colorRows = insertedVariants.flatMap((variant, index) => {
        const source = validVariants[index];

        if (!source || source.colors.length === 0) return [];

        return source.colors.map(color => ({
            variant_id: variant.id,
            color,
        }));
        });

        if (colorRows.length > 0) {
        const { error: colorError } = await supabase
            .from("variant_colors")
            .insert(colorRows);

        if (colorError) {
            console.error(colorError);
            toast.error("Gagal menyimpan warna");
        }
        }

        /* ================= RESET ================= */
        setShowAddModal(false);
        setImages([]);
        setSelectedCategories([]);
        setVariants([{ size: "", sku: "", stock: 0, colors: [] }]);
        setForm({
        name: "",
        description: "",
        price: "",
        old_price: "",
        discount: "",
        category: "",
        });

        toast.success("Product berhasil ditambahkan");
    } catch (err) {
        console.error(err);
        toast.error("Terjadi error saat submit product");
    }
    };

    // image
    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
        ) => {
        if (!e.target.files) return;

        const files = Array.from(e.target.files);

        setImages((prev) => {
            const merged = [...prev, ...files];
            return merged.slice(0, 3); // max 3 gambar
        });

        // reset supaya bisa pilih lagi
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // variant
    const SIZE_OPTIONS: Record<ProductType, string[]> = {
        shirt: ["S", "M", "L", "XL", "XXL"],
        pants: ["28", "29", "30", "31", "32"],
        shoes: ["38", "39", "40", "41", "42"],
    };
    const generateSKU = (
    shopCode: string,
    productCode: string,
    size: string
    ) => {
    if (!shopCode || !productCode || !size) return "";

    const rand = Math.floor(100 + Math.random() * 900); // 3 digit
    return `${shopCode}-${productCode}-${size}-${rand}`.toUpperCase();
    };

    const generateProductCode = (name: string) => {
    return name
        .toUpperCase()
        .replace(/\s+/g, "")
        .slice(0, 10);
    };

    const handleVariantChange = (
    index: number,
    field: keyof Variant,
    value: string | number
    ) => {
    const updated = [...variants];
    const current = {
        ...updated[index],
        [field]: value,
    };

    if (field === "size") {
        if (!shopCode) {
        current.sku = "";
        } else {
        const productCode = generateProductCode(form.name);
        current.sku = generateSKU(
            shopCode,
            productCode,
            current.size
        );
        }
    }

    updated[index] = current;
    setVariants(updated);
    };

    const addVariant = () =>
    setVariants([
        ...variants,
        {size: "", sku: "", stock: 0, colors: []},
    ]);

    const removeVariant = (i: number) =>
    setVariants(variants.filter((_, index) => index !== i));
    // color toggle
    const toggleColor = (variantIndex: number, color: string) => {
        setVariants((prev) =>
            prev.map((variant, i) => {
            if (i !== variantIndex) return variant;

            const hasColor = variant.colors.includes(color);

            return {
                ...variant,
                colors: hasColor
                ? variant.colors.filter((c) => c !== color)
                : [...variant.colors, color],               
            };
            })
        );
    };

    const items = {
        Products: "/Products",
    };
    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-4">
        <Breadcrumb items={items} />
        <div className="flex justify-end items-center mb-4 text-sm">
            <button
            onClick={() => setShowAddModal(true)}
            className="flex justify-center items-center gap-3 p-2 cursor-pointer rounded-lg text-white font-semibold bg-primary hover:bg-secondary transition duration-200"
            >
            <FaPlus /> Add Product
            </button>
        </div>

        {/* Grid Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => {
                const primaryImage =
                    p.product_images?.find((img) => img.is_primary === true)?.image_url
                    || p.product_images?.[0]?.image_url
                    || "/placeholder.png";
            return (
                <div key={p.id} className="bg-white rounded-md shadow p-4">
                    <img
                        src={primaryImage || "/placeholder.png"}
                        alt={p.name}
                        className="w-full h-50 object-cover rounded-md mb-3"
                    />
                    <h3 className="text-md font-semibold text-gray-800">
                        {p.name}
                    </h3>
                    <p className="text-sm font-bold text-black">
                        {p.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        })}
                    </p>
                    <p className="text-sm text-black mb-4">
                    Stock: {p.total_stock}
                    </p>
                    <Link
                        to={`/products/details/${p.id}`}
                        className="w-auto bg-primary hover:bg-secondary text-white text-sm py-2 px-4 rounded-md transition duration-200"
                        >
                        Detail Product
                    </Link>
                </div>
            );
            })}
        </div>

        {/* Modal Add Product */}
        {showAddModal && (
            <div className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50">
                <div className="bg-gradient-to-b from-white to-primary rounded-lg mx-auto shadow-lg py-6 px-3 w-[460px]  h-[530px]">
                    <div className="flex justify-between items-center mb-4 border-b border-borderGray py-2">
                    <h2 className="text-xl font-semibold text-primary">
                        Add Product
                    </h2>
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="text-gray-500 hover:text-gray-700 hover:cursor-pointer pr-3 transition duration-200"
                    >
                        <IoIosCloseCircle className="text-2xl text-black hover:text-red-700" />
                    </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3 overflow-y-auto scrollbar-hide max-h-[350px]">
                            {/* PRODUCT NAME */}
                            <div className="flex flex-col">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                />
                            </div>
                            {/* IMAGE */}
                            <div className="flex flex-col">
                                <label>Image</label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    name="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    className="file-input"
                                />

                                    <div className="flex gap-2 mt-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                        key={i}
                                        className="w-24 h-24 border border-gray-300 shadow-lg rounded-md flex items-center justify-center"
                                        >
                                        {images[i] ? (
                                            <img
                                            src={URL.createObjectURL(images[i])}
                                            className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <span className="text-black text-sm">
                                            Image {i + 1}
                                            </span>
                                        )}
                                        </div>
                                    ))}
                                    </div>
                            </div>
                            {/* PRICE */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col">
                                    <label>Price</label>
                                    <input
                                    type="text"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label>Old Price</label>
                                    <input
                                    type="text"
                                    name="old_price"
                                    value={form.old_price}
                                    onChange={handleChange}
                                    className="input-field"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <label>Discount</label>
                                    <input
                                    type="number"
                                    min={0}
                                    max={90}
                                    value={form.discount}
                                    onChange={(e) =>
                                        setForm(prev => ({
                                        ...prev,
                                        discount: e.target.value === "" ? "" : Number(e.target.value)
                                        }))
                                    }
                                    className="input-field"
                                    />
                            </div>
                            {/* CATEGORY */}
                            <div className="flex flex-col gap-2">
                            <label className="font-medium">Category</label>

                            <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-md p-3 bg-white text-primary">
                                {availableCategories.map(c => (
                                <label
                                    key={c.id}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(c.id)}  
                                    onChange={() =>
                                        setSelectedCategories(prev =>
                                        prev.includes(c.id)
                                            ? prev.filter(id => id !== c.id)
                                            : [...prev, c.id]
                                        )
                                    }
                                    />
                                    {c.category}
                                </label>
                                ))}
                            </div>
                            </div>

                            {/* DESCRIPTION */}
                            <div className="flex flex-col">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="input-field"
                                />
                            </div>
                            {/* variant */}
                            <div>
                                <div className="text-black ">
                                    Variant
                                </div>
                                <div className="bg-white rounded-lg overflow-hidden">
                                    {/* HEADER */}
                                    <div className="grid grid-cols-5 bg-primary text-white gap-5 p-3 text-sm font-semibold">
                                        <span>Size</span>
                                        <span>SKU</span>
                                        <span>Color</span>
                                        <span>Stock</span>
                                        <span className="text-center">Action</span>
                                    </div>
                                        {variants.map((variant, index) => (
                                            <div key={index} className="grid grid-cols-5 gap-2 my-2 px-2">
                                                <select
                                                value={variant.size}
                                                onChange={(e) =>
                                                    handleVariantChange(index, "size", e.target.value)
                                                }
                                                className="input-field"
                                                >
                                                <option value="">Size</option>
                                                {SIZE_OPTIONS[productType].map((size) => (
                                                    <option key={size} value={size}>
                                                    {size}
                                                    </option>
                                                ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={variant.sku}
                                                    readOnly
                                                    placeholder="SKU"
                                                    className="input-field"
                                                />
                                                <div className="flex gap-3 overflow-x-scroll scrollbar-hide input-field">
                                                {COLOR_OPTIONS[productType].map((color) => (
                                                <label
                                                    key={color}
                                                    className={`flex items-center gap-2 cursor-pointer
                                                        ${variant.colors.includes(color) ? "border-none" : "border-primary"}
                                                    `}
                                                    >
                                                    <label className="cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={variant.colors.includes(color)}
                                                        onChange={() => toggleColor(index, color)}
                                                        className="sr-only"
                                                    />

                                                    <span
                                                        className={`
                                                        w-7 h-7 rounded-full
                                                        border-2
                                                        flex items-center justify-center
                                                        ${variant.colors.includes(color)
                                                            ? "border-primary ring-2 ring-primary/40"
                                                            : "border-gray-300"}
                                                        `}
                                                        style={{ backgroundColor: color.toLowerCase() }}
                                                    />
                                                    </label>

                                                    </label>
                                                ))}
                                                </div>
                                                <input
                                                    type="number"
                                                    value={variant.stock}
                                                    onChange={(e) =>
                                                        handleVariantChange(
                                                            index,
                                                            "stock",
                                                            e.target.value === "" ? "" : Number(e.target.value)
                                                        )
                                                        }
                                                    className="input-field"
                                                />
                                                <div className="flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeVariant(index)}
                                                        className="text-red-500"
                                                    >
                                                        <FaTrashCan />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={addVariant}
                                    className="mt-2 px-4 py-2 bg-black text-white rounded"
                                >
                                    + Add Variant
                                </button>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                type="button"
                                onClick={() => setShowAddModal(false)}
                                className="btn-cancel"
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit">
                                Save Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
        </div>
    );
    };

    export default Products;
