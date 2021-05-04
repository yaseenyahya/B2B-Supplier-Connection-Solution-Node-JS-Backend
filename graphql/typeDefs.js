var { gql } = require("apollo-server-express");
module.exports = gql`
  type Subscription {
    chatdetailadded: ChatDetails
  }
  type ChatDetails {
    id: ID
    customerId: String
    pageId: String
    messageId: String
    messagetext: String
    messagetimestamp: String
    messagetype: String
    agentId: ID
    alternateagentId: ID
    read: Int
  }
  type OfflineChatDetails {
    id: ID
    customerId: String
    pageId: String
    messageId: String
    messagetext: String
    messagetimestamp: String
    messagetype: String
  }
  input pages_insert_input {
    name: String
    pageId: String
    accesstoken: String
  }

  type Bureaus {
    id: ID!
    name: String!
  }

  type Designations {
    id: ID!
    name: String!
    paneltype: PanelType!
  }

  enum PanelType {
    SUPERADMIN
    ADMIN
    MANAGER
    AGENT
    FINANCE
  }
  type Pages {
    id: ID!
    name: String!
    pageId: String!
    accesstoken: String!
  }

  type Profiles {
    id: ID!
    name: String!
    paneltype: PanelType!
    settings: String
  }

  enum StatusType {
    ACTIVE
    BLOCKED
    DEAD
  }
  type Users {
    id: ID!
    picture: String
    username: String!
    pseudonym: String
    password: String!
    name: String!
    email: String!
    number: String
    status: StatusType!
    comments: String
    designation: Designations!
    managerId: Users
    settings: String
    labels: String
  }
  type UserSettings {
    settings: String!
  }
  type Me {
    id: ID!
    username: String!
    pseudonym: String
    name: String!
    status: StatusType
    accessToken: String
    refreshToken: String
    designation: Designations!
    managerId: Users
    email: String!
    number: String
    picture: String
    settings: String
    labels: String
    pagesData:String
  }
  type LeadForms {
    id: ID!
    customerId: String!
    firstname: String!
    lastname: String!
    phonenumber: String!
    alternatephonenumber: String
    emailaddress: String
    previousaddress: String
    currentaddress: String!
    dateofbirth: String!
    ssn: String
    provider: Int
    service: String!
    referencenumber: String!
    accountnumber: String!
    monthlytotal: String!
    firstmonthbill: String!
    comments: String
  }

  type QueryStatus {
    success: Int!
    error: String
    result: String
  }

  type Query {
    designations: [Designations]
    designation(id: ID!): Designations
    pages: [Pages]
    page(id: ID!): Pages
    profiles: [Profiles]
    profile(id: ID!): Profiles
    users(managersOnly: Boolean): [Users]
    user(id: ID!): Users
    me(accessToken: String): Me
    usersettings(id: ID!, accessToken: String): UserSettings
    leadform(customerId: String!): [LeadForms]
    chatlastdetailsbyid: [ChatDetails]
    chatdetailsbyagentcutomerpageid(
      customerId: String!
      pageId: String!
    ): [ChatDetails]
    getfollowupbyagentid: QueryStatus
  }

  type Mutation {
    login(username: String!, password: String!): Me
    adduser(
      username: String!
      password: String!
      name: String!
      pseudonym: String
      picture: String
      email: String!
      number: String
      status: ID!
      comments: String
      designationId: ID!
      managerId: ID
      settings: String
    ): QueryStatus
    logout: QueryStatus
    updateuser(
      id: ID!
      username: String
      password: String
      name: String
      pseudonym: String
      picture: String
      email: String
      number: String
      status: ID
      comments: String
      designationId: ID
      managerId: ID
      settings: String
    ): QueryStatus
    updatelabels(labels: String!): QueryStatus
    deleteuser(id: ID!): QueryStatus
    requestresettoken(email: String!): QueryStatus
    changepasswordfromvalidresettoken(
      token: String!
      password: String!
    ): QueryStatus

    deleteprofile(id: ID!): QueryStatus
    addprofile(name: String!, paneltype: ID!, settings: String): QueryStatus
    updateprofile(
      id: ID!
      name: String
      paneltype: ID
      settings: String
    ): QueryStatus

    addpages(objects: [pages_insert_input!]): QueryStatus
    deletepage(id: ID!): QueryStatus

    adddesignation(name: String!, paneltype: ID!): QueryStatus
    updatedesignation(id: ID!, name: String, paneltype: ID): QueryStatus
    deletedesignation(id: ID!): QueryStatus

    addleadform(
      customerId: String!
      firstname: String!
      lastname: String!
      phonenumber: String!
      alternatephonenumber: String
      emailaddress: String
      previousaddress: String
      currentaddress: String!
      dateofbirth: String!
      ssn: String
      provider: Int
      service: String!
      referencenumber: String!
      accountnumber: String!
      monthlytotal: String!
      firstmonthbill: String!
      comments: String
    ): QueryStatus
    updateleadform(
      id: ID!
      firstname: String!
      lastname: String!
      phonenumber: String!
      alternatephonenumber: String
      emailaddress: String
      previousaddress: String
      currentaddress: String!
      dateofbirth: String!
      ssn: String
      service: String!
      provider: Int
      referencenumber: String!
      accountnumber: String!
      monthlytotal: String!
      firstmonthbill: String!
      comments: String
    ): QueryStatus
    deleteleadform(id: ID!): QueryStatus
    updateme(
      id: ID!
      username: String!
      name: String!
      pseudonym: String
      picture: String
      email: String!
      number: String
      currentpassword: String!
      newpassword: String
    ): QueryStatus
    addchatdetail(
      customerId: String!
      pageId: String!
      messageId: String
      messagetext: String!
      messagetimestamp: String!
      messagetype: String!
      agentId: ID!
      alternateagentId: ID
    ): QueryStatus
    addofflinechatdetail(
      customerId: String!
      pageId: String!
      messageId: String
      messagetext: String!
      messagetimestamp: String!
      messagetype: String!
    ): QueryStatus
    getofflinechatdetailanddeleteall(
      customerId: String!
      pageId: String!
      messageId: String
      messagetext: String!
      messagetimestamp: String!
      messagetype: String!
    ): [OfflineChatDetails]
    addchattofacebook(
      customerId: String!
      pageId: String!
      message: String!
      outgoingMessageId:String!
      accesstoken:String
    ): QueryStatus
    markreadchat(
      id: ID!
    ): QueryStatus
  }
`;
