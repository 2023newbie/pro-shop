import { USERS_URL } from '../constants'
import { apiSlice } from './apiSlice'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: data => ({
        url: USERS_URL + '/auth',
        method: 'post',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: data => ({
        url: USERS_URL,
        method: 'post',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: USERS_URL + '/logout',
        method: 'post',
      }),
    }),
    profile: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5 
    }),
    deleteUser: builder.mutation({
      query: id => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      })
    }),
    getUserDetails: builder.query({
      query: id =>({
        url: `${USERS_URL}/${id}`
      }),
      keepUnusedDataFor: 5
    }),
    updateUser: builder.mutation({
      query: data => ({
        url: `${USERS_URL}/${data._id}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['User']
    })
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useGetUserDetailsQuery,
  useUpdateUserMutation
} = usersApiSlice
