import {useQuery, useMutation, queryCache} from 'react-query'
import {setQueryDataForBook} from './books'
import * as listItemsClient from './list-items-client'

function useListItem(bookId, options) {
  const listItems = useListItems(options)
  return listItems?.find(li => li.bookId === bookId) ?? null
}

function useListItems({onSuccess, ...options} = {}) {
  const {data: listItems} = useQuery(
    'list-items',
    () => listItemsClient.read().then(d => d.listItems),
    {
      onSuccess: async listItems => {
        await onSuccess?.(listItems)
        for (const listItem of listItems) {
          setQueryDataForBook(listItem.book)
        }
      },
      ...options,
    },
  )
  return listItems ?? []
}

const defaultMutationOptions = {
  onError: (err, variables, recover) =>
    typeof recover === 'function' ? recover() : null,
  onSettled: () => queryCache.refetchQueries('list-items'),
  useErrorBoundary: false,
  throwOnError: true,
}

function onUpdateMutation(newItem) {
  const previousItems = queryCache.getQueryData('list-items')

  queryCache.setQueryData('list-items', old => {
    return old.map(item => {
      return item.id === newItem.id ? {...item, ...newItem} : item
    })
  })

  return () => queryCache.setQueryData('list-items', previousItems)
}

function useUpdateListItem(options) {
  return useMutation(updates => listItemsClient.update(updates.id, updates), {
    onMutate: onUpdateMutation,
    ...defaultMutationOptions,
    ...options,
  })
}

function useRemoveListItem(options) {
  return useMutation(({id}) => listItemsClient.remove(id), {
    onMutate: removedItem => {
      const previousItems = queryCache.getQueryData('list-items')

      queryCache.setQueryData('list-items', old => {
        return old.filter(item => item.id !== removedItem.id)
      })

      return () => queryCache.setQueryData('list-items', previousItems)
    },
    ...defaultMutationOptions,
    ...options,
  })
}

function useCreateListItem(options) {
  return useMutation(({bookId}) => listItemsClient.create({bookId}), {
    ...defaultMutationOptions,
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

/*
eslint
  no-unused-expressions: "off",
*/
