import { PromptCreator } from "@/components/prompt-creator"

export default function CreatePromptPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Create Prompt</h1>
        <p className="text-muted-foreground">Create a new AI prompt template.</p>
      </div>
      <PromptCreator />
    </div>
  )
}

