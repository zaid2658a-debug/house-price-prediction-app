import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="sheet">
      <span className="crop crop-tl" aria-hidden="true" />
      <span className="crop crop-tr" aria-hidden="true" />
      <span className="crop crop-bl" aria-hidden="true" />
      <span className="crop crop-br" aria-hidden="true" />

      <header className="title-block">
        <span className="title-block__eyebrow">Sheet 404 / Not Found</span>
        <span>India · Residential</span>
      </header>

      <main>
        <span className="not-found__code">ERROR 404</span>
        <div className="hero">
          <h1>This sheet doesn't exist.</h1>
          <p className="hero__sub">
            The page you're looking for isn't part of this drawing set.
          </p>
        </div>
        <Link to="/" className="btn-ghost">
          ↺ Back to the valuation form
        </Link>
      </main>
    </div>
  );
}