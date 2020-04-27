# knowledgebox
knowledgebox is a simple note app for Web.

## Tech stack
front end
- React
- Next.js
- TypeScript

back end
- Echo
- sqlx

## How to use
### front end
```
$ yarn
$ yarn dev
```

### back end
```
$ make build
$ make run
```

## Directory structure
```
knowledgebox/
├ backend/		- back end (Go server)
│ ├ api/
│ ├ application/
│ ├ domain/
│ ├ infra/
│ └ injector/
├ main.go		- back end entry point
└ src/			- front end (Next.js)
　 ├ components/
　 ├ models/
　 └ pages/
```