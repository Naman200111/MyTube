"use client";

import { trpc } from "@/trpc/client";

const ClientPage = () => {
  const [data] = trpc.hello.useSuspenseQuery({ text: "world" });
  return <div>Client Page: {data.greeting}</div>;
};

export default ClientPage;
