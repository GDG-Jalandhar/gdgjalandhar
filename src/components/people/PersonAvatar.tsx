import Image from "next/image";

type Props = {
  name: string;
  photo: string | null;
};

// Every person tile on the site sits in the same shared grid (`PersonGrid`), so
// the rendered size is fixed and belongs here rather than being re-derived by
// each caller. Matches the classes below: 80px in the two-column layout, 112px
// once the grid is wide enough for three or four.
const SIZES = "(min-width: 640px) 112px, 80px";

/**
 * The kit's avatar treatment: a square accent-stroked frame with a rotated
 * accent wedge in the top-left corner (Design-Philosophy.md §8, "Speaker card"
 * — portrait in an accent-stroked frame with the chevron badge).
 *
 * The wedge sits behind the photo deliberately: with a real portrait it reads
 * as the frame's corner detail, and with no portrait it's the backdrop for the
 * initial-letter placeholder. A person without a photo is a first-class state —
 * Bevy makes the field optional and organizers routinely skip it.
 *
 * `bg-surface-2` rather than `bg-surface`: this now sits inside a `bg-surface`
 * card, and the frame needs to read as a distinct plate against it.
 *
 * Sized off the grid container (`PersonGrid` owns the `@container`), not the
 * viewport — the portrait should grow with the card it sits in, and the card's
 * width is set by how many columns that container has room for.
 */
export function PersonAvatar({ name, photo }: Props) {
  return (
    <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-[1.5px] border-accent bg-surface-2 @md:h-28 @md:w-28">
      <div className="absolute -left-3 -top-3 h-10 w-10 rotate-45 bg-accent-soft" />
      {photo ? (
        <Image src={photo} alt="" fill sizes={SIZES} className="object-cover" />
      ) : (
        <span className="text-h3 font-bold text-accent-text @md:text-h2">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
