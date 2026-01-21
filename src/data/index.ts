import type {
    TMenuLink,
    TSlider,
    TGridItem,
    TSale,
    TEvent,
    TBrands,
    TStat,
    TDeal
} from '../types/types'
import { 
  sliderImages,trending,saleImages, productall,promoSlider, sliderEvent, brandslider, ImageCheckout,
  } from "../assets/image/index"; 

export const menuLinks: TMenuLink[] = [
    {
        id: 1,
        name: "Home",
        path: "/#",
    },
    {
        id: 2,
        name: "Clotches",
        path: "/Clotches",
    },
    {
        id: 3,
        name: "Pants",
        path: "/Pants",
    },
    {
        id: 4,
        name: "Shoes",
        path: "/Shoes",
    },
    {
        id: 5,
        name: "Accessories",
        path: "/Accessories",
    },
    {
        id: 6,
        name: "Collections",
        path: "/Collections",
    },
    {
        id: 7,
        name: "Brands",
        path: "/Brands",
    },
];

export const slider: TSlider[] = [
  {
    id: 1,
    img: sliderImages.shoes ,
    subtitle: "Urban’ Attire",
    title: "Streetwear",
    title2: "Festival 2025",
    background: sliderImages.bgshoes,
  },
  {
    id: 2,
    img: sliderImages.tas,
    subtitle: "Urban’ Attire",
    title: "Streetwear",
    title2: "Festival 2025",
    background: sliderImages.bgtas,
  },
  {
    id: 3,
    img: sliderImages.jam,
    subtitle: "Urban’ Attire",
    title: "Streetwear",
    title2: "Festival 2025",
    background: sliderImages.bgjam,
  },
];
export const data: TGridItem[] = [
    { imageUrl: trending.tasgucci, column: "4", row: "1" },
    { imageUrl: trending.sepatujordan, column: "2", row: "1 / 3" },
    { imageUrl: trending.sepatuNike, column: "3 / 5", row: "2 / 4" },
    { imageUrl: trending.sepatu, column: "3", row: "1" },
    { imageUrl: trending.jamrolex, column: "1", row: "1" },
    { imageUrl: trending.jamputih, column: "2", row: "3" },
    { imageUrl: trending.taslv, column: "1", row: "2 / 4" },
];
export const sale: TSale[] = [
  {
    id: 1,
    name: "Setelan Hijab",
    price: 86000,
    oldPrice: 120000,
    discount: 40,
    imageUrl: saleImages.kids,
  },
  {
    id: 2,
    name: "Kemeja Putih",
    price: 97000,
    oldPrice: 182000,
    discount: 32,
    imageUrl: saleImages.jaketkemeja,
  },
  {
    id: 3,
    name: "Nike Sneakers",
    price: 182000,
    oldPrice: 420000,
    discount: 42,
    imageUrl: saleImages.nike,
  },
  {
    id: 4,
    name: "Dress Elegan",
    price: 126000,
    oldPrice: 220000,
    discount: 52,
    imageUrl: saleImages.dress,
  },
  {
    id: 5,
    name: "Celana Cargo",
    price: 56000,
    oldPrice: 90000,
    discount: 20,
    imageUrl: saleImages.jeans,
  },
  {
    id: 6,
    name: "Gamis Coklat",
    price: 142000,
    oldPrice: 170000,
    discount: 15,
    imageUrl: saleImages.dresslebaran,
  },
];
//promo
export const promo: TSlider [] = [
  {
    id: 1,
    img: promoSlider.promo,
    subtitle: "Urban",
    title: "fashion",
    title2: "Diskon Hingga 50%",
    background: sliderImages.bgtas,
  },
  {
    id: 2,
    img: sliderImages.shoes,
    subtitle: "Urban",
    title: "Show Now",
    title2: "Diskon Hingga 50%",
    background: promoSlider.bg,
  },
];
export type TReviews = {
  name: string;
  imageProfile: string;
  date: string;
  variasi: string;
  ulasan: string;
  like: number;
  imageUlasan: string;
  imageUlasan2: string;
};

export const reviews: TReviews [] = [
      {
        name: "John Doe",
        imageProfile: ImageCheckout.profile.Renjun,
        date: "12 Januari 2025",
        variasi: "Blue / M",
        ulasan: "Bahan kemeja sangat nyaman dan rapi, cocok untuk kerja dan acara formal.",
        like: 12,
        imageUlasan: ImageCheckout.Kemeja.KemejaBlue,
        imageUlasan2: ImageCheckout.Kemeja.KemejaGrey,
      },
      {
        name: "Jane Smith",
        imageProfile: ImageCheckout.profile.Jeno,
        date: "15 Januari 2025",
        variasi: "Gray / L",
        ulasan: "Ukuran pas, warna sesuai gambar, sangat puas dengan pembelian ini.",
        like: 8,
        imageUlasan: ImageCheckout.KemejaMen.KemejaNavy,
        imageUlasan2: ImageCheckout.KemejaMen.KemejaBlack,
        
      },
      {
        name: "Michael Lee",
        imageProfile: ImageCheckout.profile.Jaemin,
        date: "18 Januari 2025",
        variasi: "Tosca / XL",
        ulasan: "Kemeja berkualitas tinggi, jahitan rapi dan nyaman dipakai seharian.",
        like: 5,
        imageUlasan: ImageCheckout.Kemeja.KemejaGrey,
        imageUlasan2: ImageCheckout.KemejaMen.KemejaNavy,
      },
];
export const event: TEvent[] =[
  {
    id: 1,
    img: sliderEvent.event2,
    background: sliderEvent.event,
  },
  {
    id: 2,
    img: sliderEvent.gratong1,
    background: sliderEvent.gratong,
  },
  {
    id: 3,
    img: sliderEvent.diskon2,
    background: sliderEvent.diskon,
  },
];
export const brands: TBrands[] =[
  {
    id: 1,
    img: brandslider.NIKE,
  },
  {
    id: 2,
    img: brandslider.puma,
  },
  {
    id: 3,
    img: brandslider.Lv,
  },
  {
    id: 4,
    img: brandslider.casio,
  },
  {
    id: 5,
    img: brandslider.lauren,
  },
  {
    id: 6,
    img: brandslider.adidas,
  },
];

//dashboard

export const stats: TStat[] = [
  {
    title: 'Total User',
    value: '40,689',
    icon: '/image/dashboard/user.png',
    trend: { type: 'up', value: '8.5%', text: 'Up from yesterday' },
  },
  {
    title: 'Total Order',
    value: '10,293',
    icon: '/image/dashboard/order.png',
    trend: { type: 'up', value: '1.3%', text: ' Up from past week' },
  },
  {
    title: 'Total Sale',
    value: '$89,000',
    icon: '/image/dashboard/sale.png',
    trend: { type: 'down', value: '4.3%', text: 'Down from yesterday' },
  },
  {
    title: 'Total Pending',
    value: '2,040',
    icon: '/image/dashboard/pending.png',
    trend: { type: 'up', value: '5%', text: 'since last week' },
  },
];

export const deals: TDeal[] = [
  {
    picture: productall.brownJacket2,
    product_name: 'Classic Neutral Jacket Series',
    location: 'Marjolaine Landing',
    date_time: '12.09.2019 - 14:20',
    piece: 423,
    amount: '100.000',
    status: 'Completed',
  },
  {
    picture: productall.blackTshirt,
    product_name: 'Waistcoat Series',
    location: 'Korea Selatan',
    date_time: '12.09.2019 - 12:40',
    piece: 100,
    amount: '150.000',
    status: 'Pending',
  },
  {
    picture:  productall.whiteShirtFormal,
    product_name: 'Vintage Jacket Series',
    location: 'Jakarta Selatan',
    date_time: '12.09.2019 - 12:40',
    piece: 250000,
    amount: '150.000',
    status: 'Rejected',
  },
];

