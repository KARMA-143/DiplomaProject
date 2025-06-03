class messageDTO {
    constructor(message) {
        this.id = message.id;
        this.content = message.content;
        this.createdAt= message.createdAt;
        this.updatedAt= message.updatedAt;
        this.user = message.User;
    }
}

module.exports = messageDTO;