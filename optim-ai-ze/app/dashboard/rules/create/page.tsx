import { RuleCreator } from "@/components/rule-creator"

export default function CreateRulePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create Rule</h1>
        <p className="text-muted-foreground">Create a new rule for your AI prompts.</p>
      </div>
      <RuleCreator />
    </div>
  )
}

