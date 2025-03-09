import { gql } from '@apollo/client';

export const CREATE_USER = gql`
    mutation createUser($input: UserInput!) {
        createUser(input: $input) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN_USER = gql`
    mutation loginUser($password: String!, $username: String, $email: String) {
        login(password: $password, username: $username, email: $email) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: BookInput!) {
        saveBook(input: $input) {
            _id
            username
            savedBooks {
                bookId
                title
                authors
                description
                link
                image
            }
        }
    }
`;

export const DELETE_BOOK = gql`
    mutation deleteBook($bookId: String!) {
        deleteBook(bookId: $bookId) {
            _id
            username
            savedBooks {
                bookId
                title
                authors
                description
                link
                image
            }
        }
    }
`;