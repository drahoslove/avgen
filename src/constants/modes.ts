import { z } from 'zod'

export const modeSchema = z.enum(['default', 'pro'] as const)

export type Mode = z.infer<typeof modeSchema>
