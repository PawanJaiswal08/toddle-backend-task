const {
    GraphQLList,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLString,
    GraphQLError,
} = require(`graphql`);

const User = require(`./../models/user`);
const ClassRoom = require(`./../models/classroom`);
const File = require(`./../models/file`);

const UserType = new GraphQLObjectType({
    name: `User`,
    description: `This represents a user in the system`,
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        firstname: { type: GraphQLNonNull(GraphQLString) },
        lastname: { type: GraphQLNonNull(GraphQLString) },
        email: { type: GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLNonNull(GraphQLString) },
    }),
});

const ClassRoomType = new GraphQLObjectType({
    name: `ClassRoom`,
    description: `This represents a classroom`,
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        tutor: {
            type: UserType,
            resolve: async (classroom) => {
                const user = await User.findById(classroom.tutor);
                return user;
            },
        },
        students: { type: GraphQLList(GraphQLString) },
    }),
});

const FileType = new GraphQLObjectType({
    name: `File`,
    description: `This represents a file`,
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLString) },
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        filetype: { type: GraphQLNonNull(GraphQLString) },
        uploaded_by: {
            type: UserType,
            resolve: async (file) => {
                const user = await User.findById(file.uploaded_by);
                return user;
            },
        },
        classroom: {
            type: ClassRoomType,
            resolve: async (file) => {
                const classroom = await ClassRoom.findById(file.classroom);
                return classroom;
            },
        },
    }),
});

module.exports = {
    UserType: UserType,
    ClassRoomType: ClassRoomType,
    FileType: FileType,
};
