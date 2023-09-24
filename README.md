# Vocab

A simple vocabulary app for learning new words.

## Idea 
vocab is a simple vocabulary app for learning words of a foreign language. It features various pages:

- **All Words**: a list with all stored words
- **Learned Words**: a list with all words that have been learneed
- **Flash Cards**: Words can be learned using flash cards. Only "learned words" are used for this mode
- **Generator**: randomly selects word that weren't learned yet

For working properly, vocab needs a database to store the words. The schema is depicted in the `schema.prisma` file. 

## Deployment
No matter how you want to deploy this application, you need to specify the environment variables as stated in the `.env.example` file.

### Deploy on your own
You can deploy this application on your own server. Just clone this repository and run `npm install` and `npm run build`. Then you can run the application with `npm start`.

### Deploy with Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fcuvar%2Fvocab)

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

This project is licensed under the [MIT](./LICENSE) license.