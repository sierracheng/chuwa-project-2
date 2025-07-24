import {gql} from "graphql-tag";

export const typeDefs = gql`
    scalar Date

    enum Role {
        HR
        Employee
    }

    enum Gender {
        Male
        Female
        Other
    }

    enum VisaType {
        Citizen
        GreenCard
        H1B
        L2
        F1_CPT_OPT
        H4
        Other
    }

    enum Status {
        pending
        approved
        rejected
    }

    type PersonName {
        firstName: String!
        middleName: String
        lastName: String!
        preferredName: String
    }

    type ContactInfo {
        cellPhone: String!
        workPhone: String
        email: String!
    }
    
    type Address {
        street: String
        building: String
        city: String
        state: String
        zip: String
    }

    type Employment {
        visaTitle: VisaType!
        startDate: Date!
        endDate: Date!
        daysRemaining: Int!
    }

    type EmergencyContact {
        realName: PersonName!
        contactInfo: ContactInfo!
        relationship: String!
    }

    type DocumentInfo {
        profilePictureUrl: String
        driverLicenseUrl: String
        workAuthorizationUrl: String
    }
    
    type VisaFile {
        url: String
        UploadedAt: Date
    }
    
    type VisaStep {
        status: Status!
        feedback: String
        document: VisaFile
    }
        
    type Reference {
        realName: PersonName!
        contactInfo: ContactInfo!
    }

    type OnboardingApplication {
        _id: ID!
        userId: ID!
        status: Status!
        documents: DocumentInfo!
        reference: Reference!
        feedback: String
        createdAt: Date
        updatedAt: Date
    }

    type VisaStatusManagement {
        _id: ID!
        user: ID!
        optReceipt: VisaStep
        optEAD: VisaStep
        i983: VisaStep
        i20: VisaStep
        createdAt: Date
        updatedAt: Date
    }

    type VisaEmployee {
        _id: ID!
        userId: ID!
        realName: PersonName!
        email: String!
        username: String!
        workAuth: VisaType!
        visaSteps: VisaEmployeeSteps!
        nextStep: String!
    }
    
    type VisaEmployeeSteps {
        optReceipt: VisaStep
        optEAD: VisaStep
        i983: VisaStep
        i20: VisaStep
    }
    
    type BulkUpdateResponse {
        success: Boolean!
        userId: ID!
        visastatus: VisaStatusManagement
        error: String
    }

    type User {
        _id: ID!
        username: String!
        password: String!
        email: String!
        realName: PersonName!
        ssn: String!
        dateOfBirth: Date!
        gender: Gender!
        address: Address!
        contactInfo: ContactInfo!
        employment: Employment!
        emergencyContact: EmergencyContact!
        onboardingApplication: OnboardingApplication
        role: Role!
    }

    type Query {
        me: User
        getAllUsers: [User!]!
        getUserById(id: ID!): User!
        getVisaStatusManagementByUserId(userId: ID!): VisaStatusManagement
        getOnboardingApplicationByUserId(userId: ID!): OnboardingApplication
        getAllVisaStatuses: [VisaStatusManagement!]!
        getInProgressVisaEmployees: [VisaEmployee!]!
        getCompletedVisaEmployees: [VisaEmployee!]!
        getVisaEmployeesByStatus(status: Status!): [VisaEmployee!]!
    }

    input SimpleUserInput {
        token: String!
        username: String!
        password: String!
        email: String!
    }

    input PersonNameInput {
        firstName: String!
        middleName: String
        lastName: String!
        preferredName: String
    }
    
    input ContactInfoInput {
        cellPhone: String!
        workPhone: String
        email: String!
    }
    
    input EmploymentInput {
        visaTitle: VisaType!
        startDate: Date!
        endDate: Date!
        daysRemaining: Int!
    }
    
    input EmergencyContactInput {
        realName: PersonNameInput!
        contactInfo: ContactInfoInput!
        relationship: String!
    }

    input DocumentInfoInput {
        profilePictureUrl: String
        driverLicenseUrl: String
        workAuthorizationUrl: String
    }

    input ReferenceInput {
        realName: PersonNameInput!
        contactInfo: ContactInfoInput!
    }
    
    input RegisterInput {
        username: String!
        password: String!
        token: String!
        realName: PersonNameInput!
        contactInfo: ContactInfoInput!
        dateOfBirth: Date!
        gender: Gender!
        ssn: String!
        address: String!
        employment: EmploymentInput!
        emergencyContact: EmergencyContactInput!
    }

    input OnBoardingApplicationInput {
        userId: ID!
        status: Status!
        documents: DocumentInfoInput!
        reference: ReferenceInput!
        feedback: String
    }

    input VisaStepInput {
        status: Status!
        feedback: String
        document: VisaFileInput
    }
    
    input VisaFileInput {
        url: String
        uploadedAt: Date
    }
    
    input BulkUpdateInput {
        userId: ID!
        stepName: String!
        status: Status!
        feedback: String
    }

    type Mutation {
        createSimpleUser(
            input: SimpleUserInput!
        ): User!
        updateUser(
            id: ID!
            input: RegisterInput!
        ): User!
        deleteUser(id: ID!): User!
        createOnboardingApplication(
            input: OnBoardingApplicationInput!
        ): OnboardingApplication!
        updateOnboardingApplication(
            userId: ID!
            status: Status!
            feedback: String
            input: OnBoardingApplicationInput!
        ): OnboardingApplication!
        updateApplicationStatus(
            userId: ID!
            status: Status!
            feedback: String
        ): OnboardingApplication!
        createVisaStatusManagement(
            userId: ID!
        ): VisaStatusManagement!
        updateVisaStatusStep(
            userId: ID!
            stepName: String!
            data: VisaStepInput!
        ): VisaStatusManagement!
        bulkUpdateVisaStatus(
            input: [BulkUpdateInput!]!
        ): [BulkUpdateResponse!]!
        deleteVisaStatusManagement(
            userId: ID!
        ): VisaStatusManagement!
    }
`;