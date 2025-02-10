export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  isIceCream?: boolean;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
        image?: {
          url: string;
          altText: string | null;
        };
      };
    }>;
  };
}

export interface Customer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    price: {
      amount: string;
      currencyCode: string;
    };
    image: {
      url: string;
      altText: string;
    };
  };
}

export interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: Product
    }>
  }
}

export interface ShopifyResponse<T> {
  data: T
}

export interface ShopifyProductResponse {
  product: Product & {
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
        };
      }>;
    };
  };
}

export interface CustomerAccessToken {
  accessToken: string
  expiresAt: string
}

export interface CustomerUserError {
  code: string
  field: string[]
  message: string
}

export interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken: CustomerAccessToken | null
    customerUserErrors: CustomerUserError[]
  }
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export interface CollectionsResponse {
  collections: {
    edges: Array<{
      node: Collection;
    }>;
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText: string;
  };
}

export interface CartCreateResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    };
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export interface CartLinesAddResponse {
  cartLinesAdd: {
    cart: {
      id: string;
      checkoutUrl: string;
    };
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
} 