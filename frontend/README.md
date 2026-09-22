# Workflow Connector

Connect the frontend to my existing backend API.

Backend endpoint:
https://clever-baboons-strive.loca.lt/run-workflow

Use POST.

Request body:
{
"user_request": ""
}

When the user clicks "Run Workflow":

Send the request to the endpoint above.

Wait for the backend response.

Use the response as the source of truth.

Display the workflow tasks, optimized schedule, execution results, and replanning results returned by the backend.

Do not create any scheduling, carbon calculation, workflow, or replanning logic in the frontend.

Add loading and error states.

For now, connect the existing Run Workflow button/input to this API. Do not redesign the whole application.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://clever-backend-link.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f6b1a898-2431-551b-bcc3-e3f1670e32ff).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
