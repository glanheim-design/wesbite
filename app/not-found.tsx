import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="container confirmation">
      <p className="eyebrow">404 / A DIFFERENT DIRECTION</p>
      <h1>
        Let’s find the
        <br />
        <em>right material.</em>
      </h1>
      <p>
        The page you’re looking for isn’t here. Explore our material sourcing
        categories or discuss your project with us.
      </p>
      <Button href="/materials">Explore materials</Button>
    </section>
  );
}
