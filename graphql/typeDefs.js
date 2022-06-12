var { gql } = require("apollo-server-express");
module.exports = gql`
  enum RoleType {
    Admin
    Vendor
    Buyer
  }

  type User {
    id: ID!
    avatar: String
    company_name: String!
    country_code:String!
    contact_no: String!
    contact_no_verified: Boolean!
    email: String
    email_verified: Boolean!
    role: RoleType!
    password: String!
    category_a_id: String
  }

  type QueryStatus {
    success: Int!
    error: String
    result: String
  }

  type Query {
    products(id: String!): User
  }

  type Mutation {
    login(contact_no: String!, password: String!): User
    me(id: ID!): User
    register(
      avatar: String
      company_name: String!
      country_code:String!
      contact_no: String!
      contact_no_verified: Boolean!
      email: String
      email_verified: Boolean!
      role: RoleType!
      password: String!
      category_a_id: String
    ): User
    update_category_a_id(user_id: ID!, category_a_id: ID!): QueryStatus
    change_password(contact_no:String!, password: String!): QueryStatus
    check_contact_no_user_exist(contact_no:String!): QueryStatus
  }
`;
