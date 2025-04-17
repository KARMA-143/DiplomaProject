const { DataTypes } = require("sequelize");
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

});

const Post = sequelize.define("Post", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
});

const Task = sequelize.define("Task", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    dueDate: { type: DataTypes.DATE, allowNull: false },
});

const UserTask = sequelize.define("UserTask", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isMentor: {type: DataTypes.BOOLEAN, defaultValue: false},
});

const File = sequelize.define("File", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, allowNull: false },
    entityId: { type: DataTypes.INTEGER, allowNull: false },
    entityType: { type: DataTypes.ENUM("Post", "Task", "UserTask"), allowNull: false },
});

const Comment = sequelize.define("Comment", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.STRING, allowNull: false },
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

Course.belongsTo(User, { as: "creator" });
User.belongsToMany(Course, { through: CourseUsers, onDelete: "CASCADE" });
Course.belongsToMany(User, { through: CourseUsers, onDelete: "CASCADE" });
CourseUsers.belongsTo(User, {foreignKey: "UserId"});
CourseUsers.belongsTo(Course, {foreignKey: "CourseId"});

Course.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(Course);

User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User, {foreignKey: "UserId"});

Course.hasMany(Task, { onDelete: "CASCADE" });
Task.belongsTo(Course);

User.belongsToMany(Task, { through: UserTask, onDelete: "CASCADE" });
Task.belongsToMany(User, { through: UserTask, onDelete: "CASCADE" });

Comment.belongsTo(User, { as: "author" });

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
};
