import { z } from 'zod'

export const styleSchema = z.enum(['default', 'old'] as const)
