import { requireProfile } from '@/lib/auth'
import { ProfileForm } from './profile-form'

export const metadata = { title: 'Mi perfil — Dashboard' }

export default async function ProfilePage() {
  const { profile } = await requireProfile()

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Mi perfil</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
        <ProfileForm
          fullName={profile.full_name ?? ''}
          headline={profile.headline ?? ''}
          bio={profile.bio ?? ''}
          location={profile.location ?? ''}
          websiteUrl={profile.website_url ?? ''}
        />
      </div>
    </div>
  )
}
