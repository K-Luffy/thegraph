const express = require('express');
const {buildSchema} = require('graphql');
const {graphqlHTTP} = require('express-graphql');

const schema = buildSchema(`
  type Query {
    hello: String,
    kidori: String,
    numtest: Float,
    people(name: String, age: Int): [Person]
  }

  type Person {
    name: String
    age: Int
  }
`);



const root = {
    hello: () => 'Hello world2!',
    kidori: () => 'developer',
    numtest: () => 123123,
    people: (args, context, info) => {
        const {name, age} = args;
        return [
            {name: "kim", age: 10},
            {name: "lee", age: 20},
            {name: "park", age: 30},
        ].filter((person) => {
            if (!name && !age) {
                return true;
            }
            if (!age && name && person.name === name) {
                return true;
            }
            if (!name && age && person.age === age) {
                return true;
            }
            if (name && age && person.name === name && person.age === age) {
                return true;
            }
            return false;
        });
    }
};

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

/* 기존 rest-api */
app.get('/rest-api', function (req, res) {
    res.send('rest-api');
});

app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));