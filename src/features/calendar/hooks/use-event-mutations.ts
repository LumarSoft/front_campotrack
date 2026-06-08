'use client'

import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query'
import { toast } from 'sonner'
import { eventsService } from '@/services/events.service'
import { useAuthToken } from '@/features/auth/hooks/use-auth-token'
import { queryKeys } from '@/lib/query-keys'
import type { ApiError } from '@/lib/api-client'
import type {
  CalendarEvent,
  CreateEventRequest,
  PostponeEventRequest,
  UpdateEventRequest,
} from '@/types/api/events'

function useEventCacheSync(): () => void {
  const queryClient = useQueryClient()
  return () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.events.all })
  }
}

function notifyError(error: ApiError): void {
  toast.error(error.message)
}

export function useCreateEvent(): UseMutationResult<CalendarEvent, ApiError, CreateEventRequest> {
  const token = useAuthToken()
  const syncCache = useEventCacheSync()
  return useMutation<CalendarEvent, ApiError, CreateEventRequest>({
    mutationFn: payload => eventsService.create(payload, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Evento creado')
    },
    onError: notifyError,
  })
}

interface UpdateEventVars {
  id: number
  payload: UpdateEventRequest
}

export function useUpdateEvent(): UseMutationResult<CalendarEvent, ApiError, UpdateEventVars> {
  const token = useAuthToken()
  const syncCache = useEventCacheSync()
  return useMutation<CalendarEvent, ApiError, UpdateEventVars>({
    mutationFn: ({ id, payload }) => eventsService.update(id, payload, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Evento actualizado')
    },
    onError: notifyError,
  })
}

interface PostponeEventVars {
  id: number
  payload: PostponeEventRequest
}

export function usePostponeEvent(): UseMutationResult<CalendarEvent, ApiError, PostponeEventVars> {
  const token = useAuthToken()
  const syncCache = useEventCacheSync()
  return useMutation<CalendarEvent, ApiError, PostponeEventVars>({
    mutationFn: ({ id, payload }) => eventsService.postpone(id, payload, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Evento aplazado')
    },
    onError: notifyError,
  })
}

export function useDeleteEvent(): UseMutationResult<void, ApiError, number> {
  const token = useAuthToken()
  const syncCache = useEventCacheSync()
  return useMutation<void, ApiError, number>({
    mutationFn: id => eventsService.remove(id, token!),
    onSuccess: () => {
      syncCache()
      toast.success('Evento eliminado')
    },
    onError: notifyError,
  })
}
