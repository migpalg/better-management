import type { ServiceOptions } from '@/features/common/service-options.ts'

// TODO: Scaffold only. We'll replace this with the real sign-in payload later.
export type LoginInput = {
  readonly email: string
  readonly password: string
}

export interface AuthService {
  login(input: LoginInput, options: ServiceOptions): Promise<void>
  refresh(options: ServiceOptions): Promise<void>
}
