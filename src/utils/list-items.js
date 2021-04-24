import {useQuery, useMutation, useQueryClient} from 'react-query'
import {setQueryDataForBook} from './books'
import {useClient} from 'context/auth-context'

function useListItem(bookId, options) {
  const listItems = useListItems(options)
  return listItems?.find(li => li.bookId === bookId) ?? null
}

function useListItems(options = {}) {
  const client = useClient()
  const queryClient = useQueryClient()

  const {data: listItems} = useQuery({
    queryKey: 'list-items',
    queryFn: () => client('list-items').then(data => data.listItems),
    ...options,
    onSuccess: async listItems => {
      await options.onSuccess?.(listItems)
      for (const listItem of listItems) {
        setQueryDataForBook(queryClient, listItem.book)
      }
    },
  })
  return listItems ?? []
}

function useUpdateListItem(options) {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation(
    updates =>
      client(`list-items/${updates.id}`, {
        method: 'PUT',
        data: updates,
      }),
    {
      onMutate(newItem) {
        const previousItems = queryClient.getQueryData('list-items')

        queryClient.setQueryData('list-items', old => {
          return old.map(item => {
            return item.id === newItem.id ? {...item, ...newItem} : item
          })
        })

        return () => queryClient.setQueryData('list-items', previousItems)
      },
      onSettled: () => queryClient.invalidateQueries('list-items'),
      ...options,
    },
  )
}

function useRemoveListItem(options) {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation(({id}) => client(`list-items/${id}`, {method: 'DELETE'}), {
    onMutate: removedItem => {
      const previousItems = queryClient.getQueryData('list-items')

      queryClient.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryClient.setQueryData('list-items', previousItems)
    },
    onSettled: () => queryClient.invalidateQueries('list-items'),
    ...options,
  })
}

function useCreateListItem(options) {
  const client = useClient()
  const queryClient = useQueryClient()

  return useMutation(({bookId}) => client('list-items', {data: {bookId}}), {
    onSettled: () => queryClient.invalidateQueries('list-items'),
    ...options,
  })
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useCreateListItem,
}
