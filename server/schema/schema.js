const graphql = require('graphql');
const _ = require('lodash');
const Author = require('../models/author');
const Book = require('../models/book');


// here we define our schema
// which describes the object types, relations btwn those obj types and interactions

const {GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLID, GraphQLList, GraphQLSchema, GraphQLNonNull} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    // we have to wrap this fields inside a function instead of creating it as an object
    // because if we define it is an object we will have a catch 22 situation with the other objectType as undefined
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: { type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // return _.find(authors, {id: parent.authorId});
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: { type: GraphQLInt},
        // each author can have a list of books
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, {authorId: parent.id});
                return Book.find({authorId: parent.id});
            }
         }
    })
});

// Root queries - these are the entry points
// from where we can jump in and navigate for data
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    // this time we directly have it as an object instead of a function
    fields: {
        // this is what we will use to query for data
        book: {
            type: BookType,
            // here we need an args while querying for book
            // to distinguish btwn which book we want to query
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // here we write code to get the data from db or any other source
                //  return _.find(books, {id: args.id});
                return Book.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return books;
                return Book.find({});
            }
        },
        author: {
            type: AuthorType,
            args: {id: {type: GraphQLID}},
            resolve(parent, args) {
                // return _.find(authors, {id: args.id});
                return Author.findById(args.id);
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                // return authors;
                return Author.find({});
            }
        }
    }
});

// Mutation is a way of changing data - adding, deleting etc.
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });

                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });

                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});