export type TMenuLink ={
    id: number;
    name: string;
    path: string;
}
export type AccountTab =
  | "biodata"
  | "address"
  | "payment"
  | "security";

export type TSlider ={
    id: number;
    img: string | undefined; 
    subtitle: string;
    title: string;
    title2: string;
    background: string | undefined;
}
export type TGridItem = {
    imageUrl: string;
    column: string;
    row: string;
};
export type TSale = {
    id: number;
    name: string;
    price: number;
    oldPrice: number;
    discount: number;
    imageUrl: string;
};
// types.ts
export type TProduct = {
  id: string;
  name: string;
  price: number;
  discount: number | null;
  total_stock: number;

  product_images: {
    image_url: string;
    is_primary: boolean;
  }[];

  product_categories: {
    category_codes: {
      category: string;
      code: string;
    }[];
  }[];
};

export type TCard = {
  id: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  discount?: string;
  rating?: number;
  sold?: number;        
  image: string;
  category: string[];      

  detail?: {
    image2?: string;
    image3?: string;
    title?: string;
    keterangan?: string;

    titleToko?: string;
    img?: string;          // logo toko
    ratingToko?: string;
    reviewsToko?: number;
    jam?: string;

    color?: string[];
    sizes?: string[];
    stokTersedia?: number;

    reviews?: {
      name: string;
      imageProfile: string;
      date: string;
      variasi: string;
      ulasan: string;
      imageUlasan?: string;
      imageUlasan2?: string;
      like?: number;
    }[];
  };
};

export type DBVariantColor = {
  color: string;
};

export type DBProductImage = {
  url: string;
};

export type DBProduct = {
  id: string;
  name: string;
  product_images: DBProductImage[];
};

export type DBProductVariant = {
  id: string;
  size: string;
  stock: number;
  price: number;
  product: DBProduct;
  variant_colors: DBVariantColor[];
};

export type DBCartItemRow = {
  qty: number;
  product_variants: DBProductVariant;
};

export type TEvent= {
    id: number;
    img: string;
    background: string;
}
export type TBrands= {
    id: number;
    img: string;
}
export type TProductLain = {
    id: number;
    data: TCard[];
};

// dashboard 
export interface BreadcrumbItems {
    [label: string]: string;
}

export interface TTrend {
    type: 'up' | 'down';
    value: string;
    text: string;
}

export interface TStat {
    title: string;
    value: string;
    icon: string;
    trend: TTrend;
}

export interface TDeal {
    picture: string;
    product_name: string;
    location: string;
    date_time: string;
    piece: number | string;
    amount: string;
    status: 'Delivered' | 'Completed' | 'Pending' | 'Rejected' | string;
}
