import { Prompt } from '@/types/prompt'
import { Button } from './ui/button'

interface PromptExportProps {
  prompt?: Prompt
}

export function PromptExport({ prompt }: PromptExportProps) {
  const handleExport = () => {
    if (!prompt) return
    
    const blob = new Blob([JSON.stringify(prompt, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${prompt.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportAll = () => {
    const prompts = localStorage.getItem('prompts')
    if (!prompts) return
    
    const blob = new Blob([prompts], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'all-prompts.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {prompt ? (
        <Button onClick={handleExport} aria-label="Download prompt">
          Download
        </Button>
      ) : (
        <Button onClick={handleExportAll} aria-label="Export all prompts">
          Export All
        </Button>
      )}
    </div>
  )
} 