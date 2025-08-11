Visual View ::

<img width="1920" height="1015" alt="Home Page" src="https://github.com/user-attachments/assets/7dd27a56-a464-4b5d-9694-ddc1e671beda" />
<img width="1920" height="1019" alt="Trending" src="https://github.com/user-attachments/assets/b3f9b47c-4036-4660-a04c-451dcd99e3d7" />
<img width="1920" height="1080" alt="User Channel" src="https://github.com/user-attachments/assets/b364fe57-d781-4c92-8f0f-576e0dbe35fb" />
<img width="1920" height="1080" alt="Video Player" src="https://github.com/user-attachments/assets/18d732f5-9068-4e56-a043-87a3563b3f7f" />
<img width="1920" height="1080" alt="Playlists" src="https://github.com/user-attachments/assets/f4eac4e8-13e9-4685-abbb-fa8b280e378d" />
<img width="1920" height="1080" alt="Playlist Id" src="https://github.com/user-attachments/assets/1fe3d338-18c3-4b99-9d44-35eea052a7ca" />
<img width="1920" height="1080" alt="Comments" src="https://github.com/user-attachments/assets/298d6cc6-d8d6-4330-8c13-ce3521c5f477" />


Live link: https://my-tube-two-lac.vercel.app/

Mux Free Account: Removes video after 24 hours of upload and max video length is 10 seconds.

export dynamic = 'force-dynamic' is required if there is server side fetching on a page.
A page which is dependent on query-params/cookies/sessions/auth -> to prerender -> needs to have to force-dynamic -> to let nextjs know that they are dynamic pages -> and not static

On each refresh needs to be re-rendered

Note: Pages using searchParams are treated as dynamic by default.
