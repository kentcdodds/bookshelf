import {useQuery, useMutation, queryCache} from 'react-query'
import * as listItemsClient from './list-items-client'

function useListItem(bookId, options) {
  const listItems = useListItems(options)
  return listItems?.find(li => li.bookId === bookId) ?? null
}

function useListItems(options) {
  const {data: listItems} = useQuery(
    'list-items',
    () => listItemsClient.read().then(d => d.listItems),
    options,
  )
  return listItems ?? []
}

const defaultMutationOptions = {
  onSettled: () => queryCache.refetchQueries('list-items'),
  useErrorBoundary: false,
  throwOnError: true,
}

function useListItemMutation(callback, options) {
  return useMutation(callback, {
    ...defaultMutationOptions,
    ...options,
  })
}

function useUpdateListItem(listItem, options) {
  return useListItemMutation(
    updates => listItemsClient.update(listItem.id, updates),
    options,
  )
}

function useRemoveListItem(listItem, options) {
  return useListItemMutation(() => listItemsClient.remove(listItem.id), options)
}

function useMarkListItemAsRead(listItem, options) {
  return useListItemMutation(
    () => listItemsClient.update(listItem.id, {finishDate: Date.now()}),
    options,
  )
}

function useMarkListItemAsUnread(listItem, options) {
  return useListItemMutation(
    () => listItemsClient.update(listItem.id, {finishDate: null}),
    options,
  )
}

function useCreateListItem(bookId, options) {
  return useListItemMutation(() => listItemsClient.create({bookId}), options)
}

export {
  useListItem,
  useListItems,
  useUpdateListItem,
  useRemoveListItem,
  useMarkListItemAsRead,
  useMarkListItemAsUnread,
  useCreateListItem,
}
