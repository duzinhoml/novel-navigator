import { User } from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
    _id: string;
    username: string;
    email: string;
    password: string;
    savedBooks: Book[]
}

interface Book {
    _id: string;
    authors: string[];
    description: string;
    bookId: string;
    image: string;
    link: string;
    title: string
}

interface SearchSingleUserArgs {
    input: {
        userId?: string;
        username?: string;
    }
}

interface CreateUserArgs {
    input: {
      username: string;
      email: string;
      password: string;
    }
  }

interface SaveBookArgs {
    input: {
        authors: string[];
        description: string;
        bookId: string;
        image: string;
        link: string;
        title: string;
    }
  }

interface DeleteBookArgs {
    bookId: string;
}

interface Context {
    user?: User;
}

const resolvers = {
    Query: {
        me: async (_: unknown, _args: unknown, context: Context) => {
            if (context.user) {
                return await User.findOne({ _id: context.user._id });
            }
            throw new Error('Not authenticated');
        },
        getSingleUser: async (_: unknown, { input }: SearchSingleUserArgs, context: Context) => {
            if (context.user) {
                return await User.findOne({
                    $or: [{ _id: context.user._id }, { username: context.user.username }]
                });
            }
            else {
                return await User.findOne({
                    $or: [{ _id: input.userId }, { username: input.username }]
                });
            }
        }
    },
    Mutation: {
        createUser: async (_: unknown, { input }: CreateUserArgs) => {
            const user = await User.create ({ ...input });
            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        login: async (_: unknown, { username, email, password }: { username: string; email: string; password: string }) => {
            const user = await User.findOne({ $or: [{ username }, { email }] });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Not authenticated');
            }

            const token = signToken(user.username, user.email, user._id);

            return { token, user };
        },
        saveBook: async (_: unknown, { input }: SaveBookArgs, context: Context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: {
                        savedBooks: { ...input }
                    }},
                    { new: true}
                );

                return updatedUser;
            }
            throw new AuthenticationError('Not authenticated');
        },
        deleteBook: async (_: unknown, { bookId }: DeleteBookArgs, context: Context) => {
            if (context.user) {
                return await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: {
                        savedBooks: { bookId }
                    }},
                    { new: true }
                );
            }
            throw new AuthenticationError('Not authenticated');
        }
    }
};

export default resolvers;