# Vocab

A simple vocabulary app for learning new words.

## Idea 
vocab is a simple vocabulary app for learning words of a foreign language.

### Features

- **All Words View**: Contains a list with all stored words. Words can be modified, edited or added to `learned`
- **Learned Words**: Contains a list with all words that have been marked `learned`. 
- **Archive**: Words can be marked as `archived`, when you feel like you totally known the word. 
- **Flash Cards**: Words can be learned using flash cards. Only learned-marked words are used for this mode. Words can be randomly displayed in the native or forein language.
- **Generator**: Randomly selects word that are not marked as `learned` yet.
- **Tags**: Words can be tagged with multiple tags. Tags can be added and modified as wanted. 

Over time, I plan to add more features and improvements.

For working properly, vocab needs a database to store the words. The schema is depicted in the `schema.prisma` file. 

## Deployment
No matter how you want to deploy this application, you need to specify the environment variables as stated in the `.env.example` file.

### Deploy on your own
You can deploy this application on your own server. Just clone this repository and run `npm install` and `npm run build`. Then you can run the application with `npm start`. However, don't forget the `.env` file 😁.

### Deploy with Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcuvar%2Fvocab)

## Contributing

I appreciate any input. Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

This project is licensed under the [MIT](./LICENSE) license.