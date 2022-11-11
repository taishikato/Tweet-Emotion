# Tweet Emotion 😆😶😢

This is a chrome extension to show the sentiment of each tweet on your timeline :)

This is build with GPT-3 by Open AI.

For demonstration, it shows below in the demo video.
* Orange: Positive
* Gray: Neutral
* Blue: Negative

## Demo Video

https://user-images.githubusercontent.com/980588/201276868-290e7c8f-5bd0-4eb1-b270-24b26600dfab.mp4

## How to install

1. Open [chrome://extensions/](chrome://extensions/)
2. Click "Load unpacked" button on the top left.
3. Choose the directry where you cloned this repository.

## API calling GPT-3

You need to build an API to call GPT-3 and put it [here](https://github.com/taishikato/Tweet-Emotion/blob/main/content-script.js#L19).

I quickly made it on Deno Deploy (I really wanna use [Kuiq](https://kuiq.io/), but Supabase Edge Functions (Kuiq uses it behind the scene) currently has a problem and can't use it 🥲).

This is my code for your reference.

```javascript
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0"
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

const router = new Router();
router.get('/', async (context) => {
  const configuration = new Configuration({
    apiKey: "YOUR OPEN API KEY"
  });
  const openai = new OpenAIApi(configuration);

  const u = new URL(context.request.url);
  const tweet = u.searchParams.get('tweet')

  if (!tweet) {
    context.response.body = 'no query'
    return
  }

	try {
  	const response = await openai.createCompletion({
  	  model: "text-davinci-002",
  	  prompt: `Decide whether a Tweet's sentiment is positive, neutral, or negative.\n\nTweet: \"${tweet}\"\nSentiment:`,
  	  temperature: 0,
  	  max_tokens: 60,
  	  top_p: 1,
  	  frequency_penalty: 0.5,
  	  presence_penalty: 0,
  	});

    context.response.body = response
  } catch(err) {
    context.response.body = {status: 'error', detail: err.message}
  }
})

const app = new Application();
app.use(oakCors()); // Enable CORS for All Routes
app.use(router.routes());

console.info("CORS-enabled web server listening on port 8000");
await app.listen({ port: 8000 });
```