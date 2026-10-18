import { Fragment } from 'react'
import { introClosing, introHeader, introSections, type IntroSection } from '../content/intro'
import { Heart, HeartDivider, Sparkle, Squiggle } from './Decor'

const PASTELS = ['var(--pastel-pink)', 'var(--pastel-green)', 'var(--pastel-blue)', 'var(--pastel-purple)']

export function Intro() {
  return (
    <section aria-label="사연 안내">
      <header className="relative pt-10 pb-4 text-center">
        <Sparkle className="absolute top-6 left-2 h-7 w-7 -rotate-12" />
        <Heart className="absolute top-12 right-3 h-6 w-6 rotate-12 text-love" filled />
        <p className="text-base text-text/80">{introHeader.kicker}</p>
        <p className="font-title text-2xl text-love">{introHeader.title}</p>
        <h1 className="mt-2 font-title text-[1.6rem] leading-snug text-ink">{introHeader.headline}</h1>
      </header>

      {introSections.map((section, i) => (
        <Fragment key={section.title}>
          <HeartDivider />
          <SectionCard section={section} background={PASTELS[i % PASTELS.length]} />
        </Fragment>
      ))}

      <HeartDivider />
      <Closing />
    </section>
  )
}

function SectionCard({ section, background }: { section: IntroSection; background: string }) {
  return (
    <article className="rounded-3xl p-5 shadow-soft sm:p-6" style={{ background }}>
      <div className="flex items-center gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-paper text-3xl shadow-soft"
          aria-hidden="true"
        >
          {section.emoji}
        </span>
        <h2 className="font-title text-xl leading-snug text-ink">{section.title}</h2>
      </div>

      {section.subtitle &&
        (section.subtitle.style === 'quote' ? (
          <Quote text={section.subtitle.text} />
        ) : (
          <p className="mt-4">{section.subtitle.text}</p>
        ))}

      {section.items && (
        <ul className="mt-4 space-y-1.5">
          {section.items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-[0.55em] h-2 w-2 shrink-0 rounded-full bg-love/70" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.quotes?.map((q) => <Quote key={q} text={q} />)}

      {section.examples && (
        <div className="mt-4">
          <p>{section.examples.label}</p>
          <ul className="mt-1 space-y-0.5 font-hand text-xl text-ink">
            {section.examples.titles.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}

function Quote({ text }: { text: string }) {
  return (
    <blockquote className="mt-4 flex -rotate-1 gap-2 rounded-2xl bg-paper/90 px-4 py-3 shadow-soft">
      <Heart className="mt-[0.4em] h-4 w-4 shrink-0 text-love" filled />
      <p>{text}</p>
    </blockquote>
  )
}

function Closing() {
  return (
    <div className="relative mt-4 rounded-3xl bg-paper px-5 pt-10 pb-8 text-center shadow-soft">
      {/* 하트 씰 */}
      <span className="absolute -top-5 left-1/2 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-love text-white shadow-soft">
        <Heart className="h-5 w-5" filled />
      </span>
      <div className="space-y-4 font-hand text-[1.3rem] leading-[1.7]">
        {introClosing.paragraphs.map((lines, i) => (
          <p key={i}>
            {lines.map((line, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {line}
              </Fragment>
            ))}
          </p>
        ))}
      </div>
      <p className="mt-8 font-title text-[1.75rem] text-ink">{introClosing.signoff}</p>
      <Squiggle className="mx-auto mt-1 h-3 w-56" />
    </div>
  )
}
