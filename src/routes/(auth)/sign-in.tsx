import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/utils/auth'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => {
    if (isAuthenticated()) {
      // If already logged in, redirect to home
      throw redirect({ to: '/' })
    }
  },
  component: SignIn,
})
