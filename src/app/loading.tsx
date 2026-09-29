// Shown instantly while a page's entries load from the database, so a tap
// always gets immediate feedback instead of a frozen screen.
export default function Loading() {
  return (
    <div className="container narrow">
      <p className="loading-line">Turning the page&hellip;</p>
    </div>
  );
}
