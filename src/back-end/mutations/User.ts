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

export const FIND_USER_MUTATION = `
  mutation FindUser($input: LoginInput!) {
    findUser(input: $input) {
      success
      message
      token
      user {
        _id
        username
        role
      }
    }
  }
`;
