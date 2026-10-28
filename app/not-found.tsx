import { Button } from "@/components/ui";
export default function NotFound() {
  return (
    <section className="container confirmation">
      <h1>Page not found</h1>
      <p>
        The page you’re looking for isn’t here. Explore our material sourcing
        categories or discuss your project with us.
      </p>
      <Button href="/materials">Explore materials</Button>
    </section>
  );
}
