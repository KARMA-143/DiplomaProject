class UserDTO {
    constructor(user) {
        this.id=user.id;
        this.name=user.name;
        this.email=user.email;
        this.isActivated=user.isActivated;
    }
}

module.exports = UserDTO;