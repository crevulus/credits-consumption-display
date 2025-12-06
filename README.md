# Credits Dashboard

### Backend

```
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app
```

### Frontend

```
cd frontend
npm install
npm run dev
```

## Development steps

Development steps roughly map to the commits I've made. If you check the commit history you'll see what I added for each step.

1. Set up the monorepo, install apckages, get a minimal call between FE and BE
2. Set up a FastAPI endpoint, with calcs
3. Create the table with URL-based state management
4. Create the chart
5. Various refactoring (added this ticket during development)
6. Styling
7. README

## Decision Log

### Backend

- FastAPI > Django for speed of development
- Timestamp & decimal places - keep data raw on BE & format on FE
  - Would consider data-formatting on BE if there’s multiple FE clients
- Copied data in JSON for lowest-hanging fruit
  - “for this role we are looking for you to showcase your frontend skills”
  - We have access but nothing saying we need to make that network call every time
- Backend call is slow; code is a little sprawling
  - Focusing on frontend
- report_name is optional in the response, but I prefer explicit nulls over implicit nulls

### Frontend

- Requires TanStack table (or other table lib) because of sorting complexity
  - “It should be possible to have sorts applied to both columns at the same time”
- URL-based state store
  - “share the URL to colleagues and see the same results, with the same sorting applied”
- Flirted with using react-router to handle URL state but left it behind; too much overhead

### Future Improvements

- Pagination (on BE and table)
- Week/Month selections on the chart
- Would have sorted the code more
  - Classnames/cx, DRY, mobile-first
  - "make it work, make it right, make it fast"
- IDE warning for useReactTable; console warning for recharts

## Questions

- Why do we approximate 1 token ≈ 4 characters?
  - The way that LLMs process natural language is by splitting and encoding. Words and combinations of letters are converted into tokens. 4 chars per token is about average for a standard encoding model.
    - Verbose language and formatting bloats the token usage.
- What would be the implications of using different models (e.g. GPT-3.5 vs GPT-4) for different prompt types?
  - Different models excel at different things. For a start, different models have different context windows. GPT 3.5 has a larger context window than GPT 4 (for some reason; I plan to look into this more). Then there’s the training data; GPT 3.5 being an older model will have older training data. Early GPT models didn’t have access to the live internet whereas later ones tend to.
    - Better models do more with less context; context can be condensed.
- How would you improve token estimation in a production system?
  - Log & measure token counts in responses from LLMs
  - In TS we can se Tiktoken from OpenAI
- What kind of caching or batching strategies would you use if token metadata had to be fetched from a slow or rate-limited LLM API?
  - Caching - we can cache commonly-used vector embeddings in the client (if the same inputs/messages are frequently used)
  - Limit metadata requests e.g. by caching in memory
- Legal prompts may vary greatly in length and structure — how would you normalize token billing to be fair across users?
  - The strategy for most chat assistants, for example, is to offer different tiers/credit limits based on their model of choice. Something similar could be employed here.
    - As for confidence/intent, I'm not sure what kind of data we'd get regarding these metrics but if they're available then I don't see why not. Confidence could act as a multiplier. 0.1 confidence = 0.1 x credits_used. This is particularly important in the legal field, where a low-confidence answer could cost a case.
    - This is also an opportunity for us to educate the users and get them to buy-in to the ethos of LLMs. i.e. we could signal to them what their current credit usage is in their current chat/thread, and let them experiment with how to keep those credit usages low while keeping confidence high. We want them to act like AI-native users, rather than just blind operators of a tool they have no expertise of.
- How would you explain to a lawyer why one message costs 12 credits while another costs 2
  - I'm a big fan of parables, similies, and analogies. I'd use the opportunity to relate to the client on their level, and also assure them that we're doing the best we can to save them money - ultimately that;s what they're worried about when they ask this question. I've written an example of one in the collapsible below.

<details>
  <summary>Analogy</summary>
  
An LLM working on a prompt is a lot like a lawyer working on a property sale: no two cases are the same. Two properties may appear on the surface to be very similar: same area, same price, same size, etc. Some sales are straightforward and don't require as much work. Others, however, are complex. There might be disputes over the boundary, there might be health and safety issues, there might be a complex ownership history. Or perhaps the client request is just plain vague. You as the lawyer have to put in the work to gather all of the *context* surrounding the property. This inevitably means more hours spent so that you do the best job you possibly can for your client.

Likewise, an LLM needs to gather context to satisfy your prompt. That might involve searching knowledge bases, using external tools, or simply breaking the message down into consituent parts for absolute calrity. Best case scenario: it has all the info it needs and credit usage is low. In some cases, however, this will require more work by the LLM.

Our models are trained to minimise the work needed in order to achieve this. Your team has the experience necessary to spot a potential problem and put in the work to resolve it, something you can only get from experience. Occasionally you'll still be stumped by a new and nuanced issue, I'm sure. Our models operate in the same way: we've trained them to cover x% of cases, but occasionally there will be a case that requires a bit more investigation and a few more credits.

</details>
