import { PRODUCTS_URL, UPLOAD_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const productsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query({
      query: ({keyword, pageNumber}) => ({
        url: PRODUCTS_URL,
        params: {pageNumber, keyword}
      }),
      providesTags: ['Products'],
      keepUnusedDataFor: 5,
    }),
    getProductDetails: builder.query({
      query: productId => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      providesTags: ['Product'],
      keepUnusedDataFor: 5,
    }),
    createProduct: builder.mutation({
      query: product => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: product,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation({
      query: product => ({
        url: `${PRODUCTS_URL}/${product.productId}`,
        method: 'PUT',
        body: product,
      }),
      invalidatesTags: ['Product'],
    }),
    uploadProductImage: builder.mutation({
      query: data => ({
        url: UPLOAD_URL,
        method: 'POST',
        body: data
      })
    }),
    deleteProduct: builder.mutation({
      query: productId => ({
        url: PRODUCTS_URL + '/' + productId,
        method: 'DELETE'
      })
    }),
    createProductReview: builder.mutation({
      query: data => ({
        url: PRODUCTS_URL + '/' + data.productId + '/reviews',
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Product'],
    }),
    getTopProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top`
      }),
      keepUnusedDataFor: 5 
    })
  }),
})

export const {
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUploadProductImageMutation,
  useDeleteProductMutation,
  useCreateProductReviewMutation,
  useGetTopProductsQuery
} = productsApiSlice
