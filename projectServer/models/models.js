const { DataTypes, JSON} = require("sequelize");
const sequelize = require("../db");

const User = sequelize.define("User", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const ActivationLink = sequelize.define("ActivationLink", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    link: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const RefreshToken = sequelize.define("RefreshToken", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Course = sequelize.define("Course", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING, allowNull: false },
    cover: { type: DataTypes.STRING, allowNull: false },
});

const CourseUsers = sequelize.define("CourseUsers", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isMentor: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Post = sequelize.define("Post", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
});

const Task = sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
    openDate:{type: DataTypes.DATE, allowNull: false},
    dueDate: { type: DataTypes.DATE, allowNull: false },
});

const Test = sequelize.define("Test",{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false},
    questions: {type: DataTypes.JSON, allowNull: false},
    openDate:{type: DataTypes.DATE, allowNull: false},
    dueDate: { type: DataTypes.DATE, allowNull: false },
    timeLimit:{type:DataTypes.INTEGER}
});

const TestAttempt = sequelize.define("TestAttempt",{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startTime:{type:DataTypes.DATE, allowNull:false},
    answers:{type:DataTypes.JSON}
})

const UserTask = sequelize.define("UserTask", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    mark: {type: DataTypes.INTEGER, allowNull: true, validate: {min: 1, max: 10}}
});

const CompleteTest = sequelize.define("CompleteTest",{
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    answers: {type: DataTypes.JSON},
    mark: {type: DataTypes.INTEGER, allowNull: true, validate: {min: 1, max: 10}},
    points:{type:DataTypes.JSON}
})

const File = sequelize.define("File", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    entityType: { type: DataTypes.ENUM("Post", "Task", "UserTask"), allowNull: false },
});

const Comment = sequelize.define("Comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    entityType: { type: DataTypes.ENUM("Post", "UserTask"), allowNull: false },
});

const Chat = sequelize.define("Chat", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Message = sequelize.define("Message", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.STRING, allowNull: false },
});

const ChatUsers = sequelize.define("ChatUsers", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Invitation = sequelize.define("Invitation", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isMentor: { type: DataTypes.BOOLEAN, defaultValue: false },
})

User.hasOne(ActivationLink);
ActivationLink.belongsTo(User);

User.hasOne(RefreshToken);
RefreshToken.belongsTo(User);

Chat.hasMany(Message, { onDelete: "CASCADE" });
Message.belongsTo(Chat);

User.hasMany(Message, { onDelete: "CASCADE" });
Message.belongsTo(User);

User.belongsToMany(Chat, { through: ChatUsers, onDelete: "CASCADE" });
Chat.belongsToMany(User, { through: ChatUsers, onDelete: "CASCADE" });
ChatUsers.belongsTo(User, { foreignKey: 'UserId' });
ChatUsers.belongsTo(Chat, { foreignKey: 'ChatId' });
User.hasMany(ChatUsers, { foreignKey: 'UserId', onDelete: "CASCADE" });
Chat.hasMany(ChatUsers, { foreignKey: 'ChatId', onDelete: "CASCADE" });

Course.belongsTo(User, { as: "creator" });
User.belongsToMany(Course, { through: CourseUsers, onDelete: "CASCADE" });
Course.belongsToMany(User, { through: CourseUsers, onDelete: "CASCADE" });
CourseUsers.belongsTo(User, { foreignKey: 'UserId' });
CourseUsers.belongsTo(Course, { foreignKey: 'CourseId' });

Course.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(Course);

User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, {foreignKey: "UserId"});

Course.hasMany(Task, { onDelete: "CASCADE" });
Task.belongsTo(Course);

Course.hasMany(Test, { onDelete: "CASCADE" });
Test.belongsTo(Course);

User.belongsToMany(Task, { through: UserTask, onDelete: "CASCADE" });
Task.belongsToMany(User, { through: UserTask, onDelete: "CASCADE" });
UserTask.belongsTo(Task, { foreignKey: 'TaskId' });
UserTask.belongsTo(User, { foreignKey: "UserId" });

User.belongsToMany(Test, { through: CompleteTest, onDelete: "CASCADE" });
Test.belongsToMany(User, { through: CompleteTest, onDelete: "CASCADE" });
CompleteTest.hasMany(Test, {foreignKey:"TestId"});
CompleteTest.hasMany(User, {foreignKey:"UserId"});

User.hasMany(TestAttempt, { foreignKey: 'UserId', onDelete: 'CASCADE' });
TestAttempt.belongsTo(User, { foreignKey: 'UserId' });

Test.hasMany(TestAttempt, { foreignKey: 'TestId', onDelete: 'CASCADE' });
TestAttempt.belongsTo(Test, { foreignKey: 'TestId' });

Comment.belongsTo(User, { as: "author" });

User.hasMany(Invitation, { foreignKey: "userId", onDelete: "CASCADE" });
Course.hasMany(Invitation, { foreignKey: "courseId", onDelete: "CASCADE" });
Invitation.belongsTo(User, { as: "user", foreignKey: "userId" });
Invitation.belongsTo(Course, { as: "course", foreignKey: "courseId" });

module.exports = {
    User,
    ActivationLink,
    RefreshToken,
    Course,
    CourseUsers,
    Post,
    Task,
    UserTask,
    File,
    Comment,
    Chat,
    Message,
    ChatUsers,
    Invitation,
    Test,
    CompleteTest,
    TestAttempt
};
