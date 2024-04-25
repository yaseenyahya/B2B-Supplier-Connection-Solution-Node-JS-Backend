var { gql } = require("apollo-server-express");
module.exports = gql`
  type Subscription {
    customerqueryformsadded: CustomerQueryFormsForSubscription
  }
  enum RoleType {
    Admin
    Vendor
    Buyer
  }
  type ACategory {
    id: ID!
    name: String!
  }
  type BCategory {
    id: ID!
    name: String!
    a_category_id: String!
  }
  type CCategory {
    id: ID!
    name: String!
    b_category_id: String!
  }
  type Product {
    id: ID!
    category_b_id: ID!
    category_c_id: ID!
    product_color: String
    title: String!
    price: Int
    discount_quantity: Int
    discount_price: Int
    description: String
    user_id: ID!
    media_serialized: String!
  }
  type User {
    id: ID!
    avatar: String
    company_name: String!
    country_code: String!
    contact_no: String!
    contact_no_verified: Boolean!
    email: String
    email_verified: Boolean!
    role: RoleType!
    password: String!
    category_a_id: ID
  }

  type QueryStatus {
    success: Int!
    error: String
    result: String
  }
  type CustomerQueryFormsForSubscription {
    user_id: Int

    customerQueryForms:[CustomerQueryForms]
  }
  type CustomerQueryForms {
    id: Int!
    user_id: Int
    company_name: String
    buyer_name: String!
    location: String!
    country_code: String!
    contact_no: String!
    source_of_contact: String!
    other_platform_text: String
    status_of_query: String!
    additional_note: String
    customerQueryFormProducts: [CustomerQueryFormProducts]
  }
  type CustomerQueryFormProducts {
    id: Int!
    customer_query_form_id: Int
    product_id: Int
  }

  type Query {
    get_products_by_user_id(user_id: ID!): [Product]
    get_a_categories: [ACategory]
    get_b_categories(a_category_id: String!): [BCategory]
    get_c_categories(b_category_id: String!): [CCategory]
    get_all_customer_query_forms_by_user_id(user_id: ID!): [CustomerQueryForms]
  }

  type Mutation {
    login(contact_no: String!, password: String!): User
    me(id: ID!): User
    register(
      avatar: String
      company_name: String!
      country_code: String!
      contact_no: String!
      contact_no_verified: Boolean!
      email: String
      email_verified: Boolean!
      role: RoleType!
      password: String!
      category_a_id: ID
    ): User
    update_category_a_id(user_id: ID!, category_a_id: ID!): QueryStatus
    change_password(contact_no: String!, password: String!): QueryStatus
    check_contact_no_user_exist(contact_no: String!): QueryStatus
    check_email_user_exist(email: String!): QueryStatus
    send_email_verification_code(email: String!): QueryStatus
    update_profile(
      user_id: ID!
      avatar: String
      company_name: String!
      country_code: String!
      contact_no: String!
      contact_no_verified: Boolean!
      email: String
      email_verified: Boolean!
    ): User
    submit_contact_us(
      user_id: ID!
      subject: String!
      message: String!
    ): QueryStatus
    delete_product(product_id: ID!): QueryStatus
    edit_product(
      product_id: ID!
      user_id: ID!
      category_b_id: ID!
      category_c_id: ID!
      product_color: String
      title: String!
      price: Int
      discount_quantity: Int
      discount_price: Int
      description: String
      media_serialized: String!
    ): QueryStatus
    add_product(
      user_id: ID!
      category_b_id: ID!
      category_c_id: ID!
      product_color: String
      title: String!
      price: Int
      discount_quantity: Int
      discount_price: Int
      description: String
      media_serialized: String!
    ): Product
    add_customer_query_forms(
      user_id: ID
      company_name: String
      buyer_id:ID
      buyer_name: String!
      location: String!
      country_code: String!
      contact_no: String!
      source_of_contact: String!
      other_platform_text: String
      status_of_query: String!
      additional_note: String
      customerQueryFormProductsSearialized: String!
    ): QueryStatus
  }
`;
