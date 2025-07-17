export dynamic = 'force-dynamic' is required if there is server side fetching on a page.
A page which is dependent on query-params/cookies/sessions/auth -> to prerender -> needs to have to force-dynamic -> to let nextjs know that they are dynamic pages -> and not static

On each refresh needs to be re-rendered

Note: Pages using searchParams are treated as dynamic by default.
