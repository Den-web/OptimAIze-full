import { create } from 'zustand'
import { Prompt, prompts, getPromptById, getPromptsByCategory } from '@/lib/prompts'

interface PromptsState {
  prompts: Prompt[]
  selectedPrompt: Prompt | null
  category: Prompt['category'] | 'all'
  setSelectedPrompt: (promptId: string) => void
  setCategory: (category: Prompt['category'] | 'all') => void
  getFilteredPrompts: () => Prompt[]
}

export const usePrompts = create<PromptsState>((set, get) => ({
  prompts,
  selectedPrompt: null,
  category: 'all',
  
  setSelectedPrompt: (promptId: string) => {
    const prompt = getPromptById(promptId)
    set({ selectedPrompt: prompt || null })
  },
  
  setCategory: (category: Prompt['category'] | 'all') => {
    set({ category })
  },
  
  getFilteredPrompts: () => {
    const { category } = get()
    if (category === 'all') return prompts
    return getPromptsByCategory(category)
  }
})) 