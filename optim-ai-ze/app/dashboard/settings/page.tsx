import { SettingsForm } from "@/components/settings-form"

export default function SettingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your API keys and preferences.</p>
      </div>
      <SettingsForm />
    </div>
  )
}

