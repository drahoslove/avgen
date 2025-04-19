import { z } from 'zod'

export const styleSchema = z.enum(['default', 'prague'] as const)
