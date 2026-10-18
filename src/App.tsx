import { Intro } from './components/Intro'
import { StoryForm } from './components/StoryForm'

export default function App() {
  return (
    <main className="mx-auto max-w-xl px-4 pt-4 pb-16 sm:px-5">
      <Intro />
      <StoryForm />
    </main>
  )
}
