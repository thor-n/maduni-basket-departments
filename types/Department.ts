export interface Department {
    id: number;
    name: string;
    products_last_modified_at: string;
  }
  
  export interface ProductLabel {
    id: number;
    name: string;
    image: string;
  }
  
  export interface ProductImage {
    small: string;
    medium: string;
    large: string;
  }
  
  export interface ProductPrice {
    price: number;
    max_quantity: number | null;
    is_advertised: boolean;
    is_campaign: boolean;
    compare_unit: string;
    compare_unit_price: number;
  }
  
  export interface Product {
    id: number;
    name: string;
    underline: string;
    labels: ProductLabel[];
    images: ProductImage[];
    prices: ProductPrice[];
    temperature_zone: string;
    is_self_scale_item: boolean;
    is_weight_item: boolean;
  }