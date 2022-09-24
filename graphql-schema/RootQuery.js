const {
    GraphQLSchema,
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
} = require(`graphql`);
const { UserType, ClassRoomType, FileType } = require(`./Schema`);

const User = require(`./../models/user`);
const ClassRoom = require(`./../models/classroom`);
const File = require(`./../models/file`);

const RootQuery = new GraphQLObjectType({
    name: `Query`,
    description: `Root Query`,
    fields: () => ({
        user: {
            type: UserType,
            description: `User`,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const user = await User.findById(args.id);
                return user;
            },
        },

        users: {
            type: new GraphQLList(UserType),
            description: `List of All Users`,
            resolve: async () => {
                const users = await User.find();
                return users;
            },
        },

        classrooms: {
            type: new GraphQLList(ClassRoomType),
            description: `List of All Classrooms`,
            resolve: async () => {
                const classrooms = await ClassRoom.find();
                return classrooms;
            },
        },

        classroom: {
            type: ClassRoomType,
            description: `Classroom`,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const classroom = await ClassRoom.findById(args.id);
                return classroom;
            },
        },

        files: {
            type: new GraphQLList(FileType),
            description: `List of All Files`,
            resolve: async () => {
                const files = await File.find();
                return files;
            },
        },

        file: {
            type: FileType,
            description: `File`,
            args: {
                id: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const file = await File.findById(args.id);
                return file;
            },
        },

        file_search: {
            type: new GraphQLList(FileType),
            description: `File Search`,
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const file = await File.find({ name: args.name });
                return file;
            },
        },

        files_in_classroom: {
            type: new GraphQLList(FileType),
            description: `List of All Files in a Classroom`,
            args: {
                classroomId: { type: GraphQLNonNull(GraphQLString) },
            },
            resolve: async (parent, args) => {
                const files = await File.find({ classroom: args.classroomId });
                return files;
            },
        },
    }),
});

// const RootMutation = new GraphQLObjectType({
//     name: `Mutation`,
//     description: `Root Mutation`,
//     fields: () => ({
//         signup: {
//             type: UserType,
//             description: `Register a user`,
//             args: {
//                 firstname: { type: GraphQLNonNull(GraphQLString) },
//                 lastname: { type: GraphQLNonNull(GraphQLString) },
//                 email: { type: GraphQLNonNull(GraphQLString) },
//                 role: { type: GraphQLNonNull(GraphQLString) },
//                 password: { type: GraphQLNonNull(GraphQLString) },
//             },
//             resolve: async (parent, args) => {
//                 const newUser = await User.create({
//                     firstname: args.firstname,
//                     lastname: args.lastname,
//                     email: args.email,
//                     role: args.role,
//                     password: args.password,
//                 });

//                 return newUser;
//             },
//         },
//     }),
// });

const schema = new GraphQLSchema({
    query: RootQuery,
    // mutation: RootMutation,
});

module.exports = schema;
