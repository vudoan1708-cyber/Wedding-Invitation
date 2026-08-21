import { Divider, Monogram, OrnateFrame } from "./Ornament";
import { RsvpForm } from "./RsvpForm";
import { WeddingCalendar } from "./WeddingCalendar";
import { VenueCard } from "./VenueCard";
import { GiftPot } from "./GiftPot";
import { wedding } from "@/lib/wedding";

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-sans text-[0.65rem] tracking-[0.3em] text-ink-soft uppercase">
      {children}
    </span>
  );
}

export function InvitationLetter() {
  return (
    <article className="paper-card paper-grain relative w-full max-w-2xl overflow-hidden rounded-xs">
      <OrnateFrame />

      <div className="stagger relative px-7 pt-16 pb-28 sm:px-16 sm:pt-20 sm:pb-32">
        <header className="text-center">
          <Monogram size={58} />
          <p className="mt-8 font-serif text-base tracking-[0.14em] text-ink-soft">
            Together with their families
          </p>
        </header>

        <div className="mt-12 text-center">
          <h1 className="sr-only">
            The wedding of {wedding.groom.fullName} and {wedding.bride.fullName}
          </h1>

          <p
            aria-hidden="true"
            className="emboss font-serif text-5xl leading-tight font-light text-ink sm:text-6xl"
          >
            {wedding.groom.displayName}
          </p>
          <p className="mt-3 font-sans text-[0.65rem] tracking-[0.3em] text-ink-soft uppercase">
            {wedding.groom.fullName}
          </p>

          <p className="my-7 font-script text-4xl text-gold">and</p>

          <p
            aria-hidden="true"
            className="emboss font-serif text-5xl leading-tight font-light text-ink sm:text-6xl"
          >
            {wedding.bride.displayName}
          </p>
          <p className="mt-3 font-sans text-[0.65rem] tracking-[0.3em] text-ink-soft uppercase">
            {wedding.bride.fullName}
          </p>
        </div>

        <Divider className="my-12" />

        <p className="text-center font-serif text-lg leading-relaxed text-ink sm:text-xl">
          request the pleasure of your company
          <br />
          at their wedding ceremony
        </p>

        <div className="mt-12">
          <WeddingCalendar />
          <p className="mt-7 text-center font-serif text-lg text-ink">
            {wedding.date.long}
          </p>
        </div>

        <Divider className="my-12" />

        <div className="text-center">
          <Label>The Venue</Label>
          <div className="mt-6">
            <VenueCard />
          </div>
        </div>

        <Divider className="my-12" />

        <div className="text-center">
          <Label>{wedding.dressCode.label}</Label>
          <p className="emboss mt-4 font-serif text-3xl font-light text-ink">
            {wedding.dressCode.value}
          </p>
          <p className="mt-3 font-serif text-base text-ink-soft">
            {wedding.dressCode.note}
          </p>
        </div>

        <div className="mt-16 border-t border-gold/20 pt-14">
          <RsvpForm />
        </div>

        <div className="mt-16 border-t border-gold/20 pt-14">
          <GiftPot />
        </div>
      </div>
    </article>
  );
}
