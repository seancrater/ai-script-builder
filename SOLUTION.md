- Your editor stack choice and why
- Trade-offs made
- How to run the project locally
- What's working and what's not (why?)
- Anything you'd improve with more time

## About This Solution

### Editor Stack Choice
I chose to use VSCode due to the familiar territory but in hindsight, I would've used Cursor. I spent a _lot_ of time flip flopping between my IDE and ChatGPT to prompt engineer solutions for the implementation of the markdown parsing/serialization.

### Trade-offs Made
I went the longer-form route of using an actual React Markdown Parser. This feels like a really bloated solution just to translate Markdown to HTML, I could've simplified this down to a `dangerouslySetInnerHTML` render without so many libraries and bloat involved.

### How To Run
Locally, you'll just need Node installed (I've only tested at version 22.15.1), run `npm i`, and then `npm run dev` to spin up a local dev server at `http://localhost:5173/` assuming the port isn't used by another service.

### What's Working and What's Not
I got everything functional (to the best of my knowledge) with the exception of the slash menu despite the problem sounding fun! I did start thinking about how I'd solve that and it'd most likely involve an event listener for a slash keydown event and then the challenge would've been figuring out positioning the options menu based on the current keyboard cursor location.

### Anything I'd Improve With More Time
I'm not really too happy with the code structure in general. There's some state in the Editor that could probably be pulled into a state management framework and maybe serialization could happen on the fly in there as well as a getter. The "Save" functionality currently leverages localStorage, definitely not preferable but works for a hacky prototype.