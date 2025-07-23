export const CREATE_SIMPLE_USER_MUTATION = `
    mutation CreateSimpleUser($input: SimpleUserInput!) {
        createSimpleUser(input: $input) {
            _id
            username
            email
            role
        }
    }
`;
