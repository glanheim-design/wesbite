"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="container confirmation">
      <h1>A moment, please.</h1>
      <p>
        This page could not be loaded. Please try again or email{" "}
        <a href="mailto:info@glanheim.com">info@glanheim.com</a>.
      </p>
      <button className="button" onClick={() => reset()}>
        Try again ↗
      </button>
    </section>
  );
}
