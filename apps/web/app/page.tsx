import { trpc } from "@web/app/trpc";

export default async function Home() {
  const { greeting } = await trpc.match.match.query({
    name: "Bilbo",
  });
  return <div>{greeting}</div>;
}
