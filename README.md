# Challenge [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world)

Deploy it on **Vercel** 👆

## How to run:

### Using Vercel:

just go to this URL and use it.
https://dgraph-todo.vercel.app/

ant that's it 🎉

### Running this project from local:

- Download this repo:
  `git clone git@github.com:kiqecanijo/todo-dgraph.git`
- update dependencies:
  `npm i` or `yarn`
- Run it:
  `yarn start`
- Go to:
  http://localstorage:3000

  ant that's it 😕

### From a local Database:

- Download this repo:
  `git clone git@github.com:kiqecanijo/todo-dgraph.git`
- Download Dgraph and run it from docker:
  `docker run -it -p 8080:8080 dgraph/standalone:master`
- load your schema from this repo:
  `curl -X POST localhost:8080/admin/schema --data-binary '@schema.graphql'`
- in the `index.tsx` uncomment the line `uri: "http://localhost:8080/graphql"`:
- update dependencies:
  `npm i` or `yarn`
- Run it:
  `yarn start`
- Go to:
  http://localstorage:3000/

  ant that's it 🫤

## Disclaimer 🤔:

Backend was not pretended to be done, but it was in a simple way.

## Features

| _Feature _ | _Status_ |                                                   _Comments_                                                    |
| :--------: | :------: | :-------------------------------------------------------------------------------------------------------------: |
|    SSR     |   ⛔️    |                                                   Not needed                                                    |
|    MUI     |    ✅    | added a full design system bassed<br> on a color schema <br> suppport for dark mode from user preferences 🌙 ☀️ |
| Typescript |    ✅    |                                   100% typescipt coverage without any any 🥁                                    |
| Storybook  |   ⛔️    |                                    no custom components added, not required                                     |
|  Prettier  |    ✅    |                                              custom prettier rules                                              |
|   Eslint   |    ✅    |                    custom eslint rules, no conflics using <br> **prettier eslint** in VScode                    |
|     CD     |    ✅    |                                            **Vercel** implementation                                            |
|   Redux    |    ⚠️    |                                               used recoil instead                                               |
|   Recoil   |    ✅    |                                           Powerfull state manager 💪                                            |
|    PWA     |   ⛔️    |                                                  Not required                                                   |
|  GraphQL   |    ✅    |                                                     Working                                                     |

## Cool details:

- **All Components, variants sizes, rounds, and more are previously <br> handled by the design system, check all the setup here:**

[Design system](https://www.figma.com/file/MtBHPh5dbpvMKceYL3NYJW/MUI-for-Figma-v5.4.0---Material-UI?node-id=4662%3A14 'Design system')

|                                                                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![demo](https://i.ibb.co/Lk6RNJn/Screen-Shot-2022-05-04-at-0-39-49.png 'demo')](https://i.ibb.co/Lk6RNJn/Screen-Shot-2022-05-04-at-0-39-49.png 'demo') |

- **Redux** has been replaced by **Recoil**, if you are familiar with `useState` , then you will find it really easy to use/

- **Vercel** testing and a couple `Test` to evaluated,code enforced using TS

- and much **more** 😎
