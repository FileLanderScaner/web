import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { getCurrentUser, getCurrentProfile } from '@/lib/auth'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, profile] = await Promise.all([getCurrentUser(), getCurrentProfile()])

  return (
    <div className="flex min-h-dvh flex-col">
      <Header profile={profile} email={user?.email} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
